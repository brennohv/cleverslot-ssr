import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { BarbershopBySlugService } from 'ba-ngrx-signal-based';
import { firstValueFrom } from 'rxjs';

export const isBarbarshopActiveGuard: CanActivateFn = async (route) => {
  const barbershopBySlugService = inject(BarbershopBySlugService);
  const router = inject(Router);

  const canAccessBarbershop = async (
    route: ActivatedRouteSnapshot
  ): Promise<boolean> => {
    const barbershopSlug = route.paramMap.get('barbershopSlug')!;
    return firstValueFrom(
      barbershopBySlugService.isBarbershopActive(barbershopSlug)
    );
  };

  const canAccess = await canAccessBarbershop(route);

  if (!canAccess) {
    router.navigate(['/']);
  }

  return canAccess;
};
