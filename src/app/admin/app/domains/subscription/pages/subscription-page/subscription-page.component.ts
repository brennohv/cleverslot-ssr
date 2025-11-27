import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { StripeService } from '@admin/shared/data/services';
import { BarbershopPlanEnum } from '@admin/shared/data/types';
import { SpinnerComponent, SpinnerDirective } from 'ba-ngrx-signal-based';
import { finalize, first, shareReplay, tap } from 'rxjs';

@Component({
  selector: 'app-subscription-page',
  standalone: true,
  imports: [
    SpinnerComponent,
    MatIcon,
    TranslocoPipe,
    TranslocoDirective,
    CurrencyPipe,
    MatDivider,
    SpinnerDirective,
  ],
  templateUrl: './subscription-page.component.html',
  styleUrl: './subscription-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionPageComponent {
  readonly I18N_PREFFIX = 'mfAdmin.subscription.';
  readonly Plan = BarbershopPlanEnum;
  readonly plans = signal([
    {
      title: 'plan.basic',
      price: 4.9,
      accessMessage: 'plan.access-premium',
      manageProfessionalMessage: 'plan.manage-professionals-basic',
      type: this.Plan.BASIC,
    },
    {
      title: 'plan.enterprise',
      price: 9.9,
      accessMessage: 'plan.access-premium',
      manageProfessionalMessage: 'plan.manage-professionals',
      type: this.Plan.ENTERPRISE,
    },
  ]).asReadonly();
  #stripeService = inject(StripeService);
  #platformId = inject(PLATFORM_ID);
  isLoading = signal(true);
  isSelectPlanLoading = signal(false);
  portalSessionX = toSignal(
    this.#stripeService.getPortalSessionUrl().pipe(
      shareReplay({ refCount: true, bufferSize: 1 }),
      tap(() => this.isLoading.set(false)),
      finalize(() => this.isLoading.set(false))
    )
  );

  selectPlanSetup(plan: BarbershopPlanEnum): void {
    this.isSelectPlanLoading.set(true);
    this.#stripeService
      .getPortalSessionUrl(plan)
      .pipe(
        first(),
        tap((resp) => {
          if (isPlatformBrowser(this.#platformId)) {
            window.location.href = resp.checkoutSessionUrl;
          }
        }),
        finalize(() => this.isSelectPlanLoading.set(false))
      )
      .subscribe();
  }
}
