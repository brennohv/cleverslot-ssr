import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { StripeService } from '@admin/shared/data/services';
import { SpinnerComponent } from 'ba-ngrx-signal-based';
import { finalize, first, map, Observable, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-subcription-result-page',
  standalone: true,
  imports: [SpinnerComponent, RouterLink, TranslocoPipe,
    TranslocoDirective],
  templateUrl: './subcription-result-page.component.html',
  styleUrl: './subcription-result-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubcriptionResultPageComponent {
  readonly I18N_PREFFIX = 'mfAdmin.subscription-result.';
  #route = inject(ActivatedRoute);
  #stripeService = inject(StripeService);
  isLoading = signal(true);
  isSuccessContentX = toSignal(this.verifySessionIdSetup());

  verifySessionIdSetup(): Observable<boolean> {
    return this.#route.queryParamMap.pipe(
      first(),
      map((params) => {
        return params.get('sessionId');
      }),
      switchMap((sessionId) => {
        if (!sessionId) {
          return of({
            message: 'No sessionId',
            success: false,
          });
        }

        return this.#stripeService.checkoutSuccess(sessionId);
      }),
      map((resp) => resp.success),
      tap(() => this.isLoading.set(false)),
      finalize(() => this.isLoading.set(false))
    );
  }
}
