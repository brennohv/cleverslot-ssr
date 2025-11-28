import { Routes } from '@angular/router';
import { BarbershopOverviewPageComponent } from '@client/barbershop-overview/pages';
import { MyBookingsPageComponent } from '@client/booking/pages';
import { BarbershopSearchPageComponent } from '@client/barbershop-search/pages';
import { MyAccountPageComponent } from '@client/my-account/pages';
import { isBarbarshopActiveGuard } from './guards/is-barbershop-active.guard';
import { barbershopListResolver } from '@client/barbershop-search/data/resolvers';

export const MF_CLIENT_BARBERSHOP: Routes = [
  {
    path: '',
    component: BarbershopSearchPageComponent,
    resolve: {
      barbershopData: barbershopListResolver,
    },
  },
  {
    path: 'appointments',
    component: MyBookingsPageComponent,
  },
  {
    path: 'my-account',
    component: MyAccountPageComponent,
  },
  {
    path: ':barbershopSlug',
    canActivate: [isBarbarshopActiveGuard],
    component: BarbershopOverviewPageComponent,
  },
];
