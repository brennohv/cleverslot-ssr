import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { IEnvironment, LIBRARY_ENV } from 'ba-ngrx-signal-based';
import { BarbershopPlanEnum } from '../types';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private readonly http = inject(HttpClient);
  constructor(@Inject(LIBRARY_ENV) private env: IEnvironment) {}

  getPortalSessionUrl(
    plan: BarbershopPlanEnum = BarbershopPlanEnum.ENTERPRISE
  ) {
    return this.http.post<{
      checkoutSessionUrl: string;
      portalSessionUrl: string;
      freeTrial?: boolean;
    }>(`/custom-api/stripe/checkout-session?plan=${plan}`, {});
  }

  checkoutSuccess(sessionId: string) {
    return this.http.post<{
      message: string;
      success: boolean;
    }>(`/custom-api/stripe/checkout-success`, { sessionId });
  }
}
