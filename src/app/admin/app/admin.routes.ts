import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { BarbershopSchedulePageComponent } from '@admin/barbershop-schedule/pages';
import { BarbershopConfigPageComponent } from '@admin/barbershop-config/pages';
import {
  SubscriptionPageComponent,
  SubcriptionResultPageComponent,
} from '@admin/subscription/pages';

export const MF_ADMIN_ROUTES: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: BarbershopSchedulePageComponent,
      },
      {
        path: 'barbershop-config',
        component: BarbershopConfigPageComponent,
      },
      {
        path: 'subscription',
        component: SubscriptionPageComponent,
      },
      {
        path: 'subscription-result',
        component: SubcriptionResultPageComponent,
      },
    ],
  },
];
