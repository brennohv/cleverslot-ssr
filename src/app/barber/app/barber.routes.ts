import { Routes } from '@angular/router';
import { BarberGuard } from './guards/barber.guard';
import { BarberConfigPageComponent } from '@barber/barber-config/pages';
import { BarberSchedulePageComponent } from '@barber/schedule/pages';
import { BaarberComissionsPageComponent } from './domains/barber-comissions/pages';

export const MF_BARBER_ROUTES: Routes = [
  {
    path: '',
    canActivate: [BarberGuard],

    children: [
      {
        path: '',
        component: BarberSchedulePageComponent,
      },
      {
        path: 'barber-config',
        component: BarberConfigPageComponent,
      },
      {
        path: 'barber-comissions',
        component: BaarberComissionsPageComponent,
      },
    ],
  },
];
