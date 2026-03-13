import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import {
  AlertService,
  AuthService,
  AuthStore,
  UserStore,
} from 'ba-ngrx-signal-based';
import { firstValueFrom } from 'rxjs';

export const BarberGuard: CanActivateFn = async (route) => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const userStore = inject(UserStore);
  const alertService = inject(AlertService);

  const canAccessBarberRoute = async (
    route: ActivatedRouteSnapshot
  ): Promise<boolean> => {
    if (!userStore.barber()?.barbershopSlug || !authStore.token()) {
      return false;
    }

    const barbershopSlug = route.paramMap.get('barbershopSlug');

    if (userStore.barber()?.barbershopSlug !== barbershopSlug) {
      return false;
    }

    const me = await firstValueFrom(authService.me());

    if (
      !!me.error ||
      !me.data?.me?.barber ||
      me.data?.me?.barber?.barbershopSlug !== barbershopSlug
    ) {
      return false;
    }
    return true;
  };

  const canAccess = await canAccessBarberRoute(route);

  if (!canAccess) {
    alertService.showError('Unauthorized');
    authStore.logout();
  }
  return canAccess;
};
