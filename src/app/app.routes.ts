import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { UserType } from './core/types/user-type.model';
import { provideTranslocoScope } from '@jsverse/transloco';
import { isBarbershopActiveResolve } from 'ba-ngrx-signal-based';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/app/auth.routes').then((m) => {
        return m.MF_AUTH_BARBERSHOP;
      }),
    providers: [provideTranslocoScope('mfAuth')],
  },
  {
    path: 'landing-page',
    component: LayoutComponent,
    data: {
      userType: UserType.CLIENT,
      isLandingPage: true,
    },
    loadChildren: () =>
      import('./admin/app/domains/landing-page/landing-page.routes').then(
        (m) => {
          return m.LANDING_PAGE_ROUTE;
        }
      ),
    providers: [provideTranslocoScope('mfAdmin')],
  },
  // {
  //   path: ':barbershopSlug/barber',
  //   component: LayoutComponent,
  //   data: {
  //     userType: UserType.PROFESSIONAL,
  //   },
  //   loadChildren: () =>
  //     loadRemoteModule('mf-barber-barbershop', './routes').then((m) => {
  //       return m.MF_BARBER_ROUTES;
  //     }),
  //   resolve: { isBarbershopActive: isBarbershopActiveResolve },
  //   providers: [provideTranslocoScope('mfBarber')],
  // },
  {
    path: ':barbershopSlug/admin',
    component: LayoutComponent,
    data: {
      userType: UserType.ADMIN,
    },
    loadChildren: () =>
      import('./admin/app/admin.routes').then((m) => {
        return m.MF_ADMIN_ROUTES;
      }),
    resolve: { isBarbershopActive: isBarbershopActiveResolve },
    providers: [provideTranslocoScope('mfAdmin')],
  },
  {
    path: '',
    component: LayoutComponent,
    data: {
      userType: UserType.CLIENT,
    },
    loadChildren: () =>
      import('./client/app/client.routes').then((m) => m.MF_CLIENT_BARBERSHOP),
    providers: [provideTranslocoScope('mfClient')],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
