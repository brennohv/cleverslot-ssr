import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import {
  AlertService,
  AuthService,
  AuthStore,
  UserStore,
} from 'ba-ngrx-signal-based';
import { firstValueFrom } from 'rxjs';

export const AdminGuard: CanActivateFn = async (route) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const userStore = inject(UserStore);
  const alertService = inject(AlertService);

  const platformId = inject(PLATFORM_ID);

  // 🔥 During SSR: ALWAYS allow the route
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const canAccessAdminRoute = async (
    route: ActivatedRouteSnapshot
  ): Promise<boolean> => {
    if (!userStore.admin()?.barbershopSlug || !authStore.token()) {
      return false;
    }

    const barbershopSlug = route.paramMap.get('barbershopSlug');

    if (userStore.admin()?.barbershopSlug !== barbershopSlug) {
      return false;
    }

    const me = await firstValueFrom(authService.me());

    if (
      !!me.error ||
      !me.data?.me?.admin ||
      me.data?.me?.admin?.barbershopSlug !== barbershopSlug
    ) {
      return false;
    }
    return true;
  };

  const canAccess = await canAccessAdminRoute(route);

  if (!canAccess) {
    alertService.showError('Unauthorized');
    authStore.logout();
  }
  return canAccess;
};
