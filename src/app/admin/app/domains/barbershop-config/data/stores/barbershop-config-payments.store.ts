import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject, PLATFORM_ID } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { AlertService, UserStore, updateStateLib } from 'ba-ngrx-signal-based';
import { BarbershopConfigPaymentsService } from '../services';
import {
  IBarbershopConfigPaymentsStore,
  IBarbershopPaymentDTO,
} from '../types';
import { isPlatformBrowser } from '@angular/common';

const initialState: IBarbershopConfigPaymentsStore = {
  paymentMethods: [],
};

export const BarbershopConfigPaymentsStore = signalStore(
  withDevtools('BarbershopConfigPaymentsStore'),
  withState<IBarbershopConfigPaymentsStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const barbershopConfigPaymentsService = inject(
      BarbershopConfigPaymentsService
    );
    const userStore = inject(UserStore);
    const alertService = inject(AlertService);
    const { paymentMethods } = store;

    const getBarbershopPaymentList = rxMethod<void>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Get Barbershop payments Loading]`,
            setLoading()
          )
        ),
        debounceTime(300),
        switchMap(() => {
          return barbershopConfigPaymentsService
            .getBarbershopPayments(userStore.admin().barbershopDocId)
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (!resp.data) return;
                  if (resp.data.barbershop) {
                    updateStateLib(store, `[Set Barbershop payments]`, {
                      paymentMethods: resp.data.barbershop.paymentMethods.map(
                        (payment) => ({ value: payment.value, id: payment.id })
                      ),
                    });
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop payments Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    const updateCreatePaymentSetup = rxMethod<IBarbershopPaymentDTO>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Update Barbershop payments]`, setLoading())
        ),
        debounceTime(300),
        switchMap((newPayment: IBarbershopPaymentDTO) => {
          const isEditView = newPayment.id;
          let newPaymentList: IBarbershopPaymentDTO[];
          if (isEditView) {
            newPaymentList = paymentMethods().map((payment) => {
              if (payment?.id === newPayment?.id) {
                return { ...newPayment };
              }

              return payment;
            });
          } else {
            newPaymentList = paymentMethods().concat(newPayment);
          }

          return barbershopConfigPaymentsService
            .updatePayments({
              documentId: userStore.admin().barbershopDocId,
              data: {
                paymentMethods: newPaymentList,
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp?.data?.updateBarbershop?.paymentMethods) {
                    updateStateLib(store, `[Set Barbershop payments]`, {
                      paymentMethods:
                        resp.data.updateBarbershop.paymentMethods.map(
                          (payment) => ({
                            value: payment.value,
                            id: payment.id,
                          })
                        ),
                    });

                    alertService.showSuccess(
                      isEditView
                        ? 'shared.general-success-update'
                        : 'shared.general-success-create'
                    );
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Update Barbershop payments]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    const deletePaymentSetup = rxMethod<string>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Delete Barbershop payments]`, setLoading())
        ),
        debounceTime(300),
        switchMap((paymentId: string) => {
          const newPaymentList = paymentMethods().filter(
            (payment) => payment?.id !== paymentId
          );

          return barbershopConfigPaymentsService
            .updatePayments({
              documentId: userStore.admin().barbershopDocId,
              data: {
                paymentMethods: [...newPaymentList],
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp?.data?.updateBarbershop?.paymentMethods) {
                    updateStateLib(store, `[Set Barbershop payments]`, {
                      paymentMethods:
                        resp.data.updateBarbershop.paymentMethods.map(
                          (payment) => ({
                            value: payment.value,
                            id: payment.id,
                          })
                        ),
                    });

                    alertService.showSuccess('shared.general-success-delete');
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Delete Barbershop payments]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    return {
      getBarbershopPaymentList,
      updateCreatePaymentSetup,
      deletePaymentSetup,
    };
  }),
  withHooks({
    onInit(store) {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        store.getBarbershopPaymentList();
      }
    },
  })
);
