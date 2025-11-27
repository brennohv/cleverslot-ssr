import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject, PLATFORM_ID } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { debounceTime, pipe, switchMap, tap, throwError } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  UserStore,
  updateStateLib,
  withPaginationState,
  setPagination,
  AlertService,
  UserService,
} from 'ba-ngrx-signal-based';
import { BarbershopConfigClientsService } from '../services';
import { IAddNewClientParams, IClientListStore } from '../types';
import { PageEvent } from '@angular/material/paginator';
import { isPlatformBrowser } from '@angular/common';

const initialState: IClientListStore = {
  clients: [],
  identifier: '',
};

export const BarbershopConfigClientStore = signalStore(
  withPaginationState(),
  withDevtools('BarbershopConfigClientStore'),
  withState<IClientListStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const { pagination, identifier } = store;
    const clientsService = inject(BarbershopConfigClientsService);
    const userStore = inject(UserStore);
    const userService = inject(UserService);
    const alertService = inject(AlertService);

    const getClientList = rxMethod<string>(
      pipe(
        tap((identifier) => {
          updateStateLib(
            store,
            `[Get Barbershop client Loading]`,
            setLoading()
          );
          updateStateLib(store, `[Set Barbershop client identifier]`, {
            identifier: identifier,
          });
        }),
        debounceTime(300),
        switchMap(() => {
          return clientsService
            .getClientList({
              identifier: identifier(),
              barbershopId: userStore.admin().barbershopDocId,
              pagination: {
                pageSize: pagination.pageSize(),
                page: pagination.page(),
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (!resp.data) return;
                  updateStateLib(store, `[Set Barbershop client list]`, {
                    clients: resp.data.usersPermissionsUsers_connection.nodes,
                  });
                  updateStateLib(
                    store,
                    `[Set Barbershop clients pagination]`,
                    setPagination(
                      resp.data.usersPermissionsUsers_connection.pageInfo
                    )
                  );
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop client Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    function setBarbershopPaginator(event: PageEvent) {
      updateStateLib(store, `[Set Barbershop barbers filter]`, {
        pagination: {
          page: event.pageIndex + 1,
          pageCount: event.pageSize,
          pageSize: event.pageSize,
          total: event.length,
        },
      });

      return getClientList(identifier());
    }

    function resetPagination(): void {
      updateStateLib(store, `[Reset paginator]`, {
        pagination: {
          ...pagination(),
          page: 1,
        },
      });
    }

    const addNewClient = rxMethod<IAddNewClientParams>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Add new client loading]`, setLoading())
        ),
        debounceTime(300),
        switchMap((params) => {
          const { email, password, telephone, username } = params;
          return userService
            .createUser({
              data: {
                email: email,
                password: password,
                role: '1',
                telephone: telephone,
                username: username,
                barbershopDocId: userStore.admin().barbershopDocId,
                isCreatingClient: true,
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp?.data?.createUsersPermissionsUser?.data) {
                    getClientList(identifier());
                    alertService.showSuccess('shared.general-success-create');
                  }
                },
                error: (err) => {
                  return throwError(() => err);
                },
                finalize: () => {
                  updateStateLib(store, `[Add new client loaded]`, setLoaded());
                  params.dialogRef.close();
                },
              })
            );
        })
      )
    );

    return {
      getClientList,
      addNewClient,
      setBarbershopPaginator,
      resetPagination,
    };
  }),
  withHooks({
    onInit({ identifier, getClientList }) {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        getClientList(identifier());
      }
    },
  })
);
