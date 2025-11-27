import { signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { AlertService, updateStateLib } from 'ba-ngrx-signal-based';
import { BarbershopBySlugService } from '@client/barbershop-overview/data/services';
import { Router } from '@angular/router';
import { IBarbershopOverviewStore } from '@client/barbershop-overview/data/types';

const initialState: IBarbershopOverviewStore = {
  barbershop: {
    documentId: '',
    name: '',
    slug: '',
    establishment: [],
    paymentMethods: [],
    address: {
      number: '',
      postalCode: '',
      street: '',
    },
    images: [],
    logo: null,
    telephone: {
      internationalNumber: '',
    },
  },
};

const I18N_PREFFIX = 'mfClient.barbershop-overview.store.';

export const BarbershopOverviewStore = signalStore(
  withDevtools('barbershopList'),
  withState<IBarbershopOverviewStore>(initialState),
  withCallState(),
  withMethods((state) => {
    const barberShopService = inject(BarbershopBySlugService);

    const router = inject(Router);
    const alertService = inject(AlertService);
    return {
      getBarbershopBySlug: rxMethod<string>(
        pipe(
          tap(() =>
            updateStateLib(
              state,
              `[Get Barbershop by slug loading]`,
              setLoading()
            )
          ),
          distinctUntilChanged(),
          switchMap((slug) => {
            return barberShopService.getBarberShopBySlug(slug as string).pipe(
              tapResponse({
                next: (resp) => {
                  if (resp.data) {
                    updateStateLib(state, `[Set Barbershop by slug]`, {
                      barbershop: {
                        ...resp.data,
                      },
                    });
                  } else {
                    alertService.showError(I18N_PREFFIX + 'org-not-found');
                    router.navigate(['']);
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    state,
                    `[Get Barbershop by slug Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
          })
        )
      ),
    };
  })
);
