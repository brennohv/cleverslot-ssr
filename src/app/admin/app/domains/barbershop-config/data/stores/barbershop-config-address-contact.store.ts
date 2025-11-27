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
import { BarbershopConfigAddressContactService } from '../services';
import {
  IBarbershopAddressContactStore,
  IBarbershopAddressDTO,
  IBarbershopContactDTO,
} from '../types';
import { isPlatformBrowser } from '@angular/common';

const initialState: IBarbershopAddressContactStore = {
  address: null,
  telephone: null,
};

export const BarbershopConfigAddressContactStore = signalStore(
  withDevtools('BarbershopConfigAddressContactStore'),
  withState<IBarbershopAddressContactStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const barbershopConfigAddressContactService = inject(
      BarbershopConfigAddressContactService
    );
    const userStore = inject(UserStore);
    const alertService = inject(AlertService);

    const getBarbershopAddressContact = rxMethod<void>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Get Barbershop Address & Contact Loading]`,
            setLoading()
          )
        ),
        debounceTime(300),
        switchMap(() => {
          return barbershopConfigAddressContactService
            .getBarbershopAddressContact(userStore.admin().barbershopDocId)
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp?.data?.barbershop) {
                    updateStateLib(
                      store,
                      `[Set Barbershop Address & Contact]`,
                      {
                        address: resp.data.barbershop.address,
                        telephone: resp.data.barbershop.telephone,
                      }
                    );
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop Address & Contact Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    const updateCreateAddressSetup = rxMethod<IBarbershopAddressDTO>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Update Barbershop Address]`, setLoading())
        ),
        debounceTime(300),
        switchMap((address: IBarbershopAddressDTO) => {
          const isEditView = address?.id;
          return barbershopConfigAddressContactService
            .updateAddress({
              documentId: userStore.admin().barbershopDocId,
              data: {
                address,
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp?.data?.updateBarbershop?.address) {
                    updateStateLib(store, `[Set Barbershop Address]`, {
                      address: resp?.data?.updateBarbershop?.address,
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
                    `[Update Barbershop Address]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    const updateCreateContactSetup = rxMethod<IBarbershopContactDTO>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Update Barbershop Contact]`, setLoading())
        ),
        debounceTime(300),
        switchMap((contact: IBarbershopContactDTO) => {
          const isEditView = contact?.id;
          return barbershopConfigAddressContactService
            .updateContact({
              documentId: userStore.admin().barbershopDocId,
              data: {
                telephone: contact,
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp?.data?.updateBarbershop?.telephone) {
                    updateStateLib(store, `[Set Barbershop Contact]`, {
                      telephone: resp?.data?.updateBarbershop?.telephone,
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
                    `[Update Barbershop Contact]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    return {
      getBarbershopAddressContact,
      updateCreateAddressSetup,
      updateCreateContactSetup,
    };
  }),
  withHooks({
    onInit(store) {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        store.getBarbershopAddressContact();
      }
    },
  })
);
