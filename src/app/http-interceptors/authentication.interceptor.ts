import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from 'ba-ngrx-signal-based';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const authToken = authStore.token;
  if (authToken()) {
    const auth = req.clone({
      setHeaders: { Authorization: `Bearer ${authToken()}` },
    });
    return next(auth);
  }

  return next(req);
};
