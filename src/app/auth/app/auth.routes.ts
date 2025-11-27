import { Routes } from '@angular/router';
import { RegisterPageComponent } from './domains/auth/pages/register-page/register-page.component';
import { LoginPageComponent } from './domains/auth/pages/login-page/login-page.component';
import { ForgotPasswordPageComponent } from './domains/auth/pages/forgot-password-page/forgot-password-page.component';
import { ResetPasswordPageComponent } from './domains/auth/pages/reset-password-page/reset-password-page.component';

export const MF_AUTH_BARBERSHOP: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordPageComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordPageComponent,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
