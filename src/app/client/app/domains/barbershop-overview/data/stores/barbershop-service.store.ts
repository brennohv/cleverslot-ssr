import { signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { debounceTime, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  setPagination,
  updateStateLib,
  withPaginationState,
} from 'ba-ngrx-signal-based';
import { PageEvent } from '@angular/material/paginator';
import { BarbershopBySlugService } from '../services';
import { IBarbershopServiceStore } from '../types';

const initialState: IBarbershopServiceStore = {
  services: [],
  serviceFilter: '',
  barbershopDocId: '',
};

export const BarbershopServiceStore = signalStore(
  withPaginationState({
    pagination: {
      total: 0,
      page: 1,
      pageCount: 0,
      pageSize: 50,
    },
  }),
  withDevtools('BarbershopServiceStore'),
  withState<IBarbershopServiceStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const barbershopBySlugService = inject(BarbershopBySlugService);
    const { pagination, serviceFilter, barbershopDocId } = store;

    const getBarbershopServicesList = rxMethod<{
      serviceName: string;
      barbershopDocId: string;
    }>(
      pipe(
        tap(({ barbershopDocId, serviceName }) => {
          updateStateLib(
            store,
            `[Get Barbershop services Loading]`,
            setLoading()
          );

          updateStateLib(store, `[Set serviceFilter and barbershopDocId]`, {
            serviceFilter: serviceName,
            barbershopDocId,
          });
        }),
        debounceTime(300),
        switchMap(({ barbershopDocId }) => {
          return barbershopBySlugService
            .getBarbershopServiceList({
              serviceName: serviceFilter(),
              barbershopId: barbershopDocId,
              pagination: {
                pageSize: pagination.pageSize(),
                page: pagination.page(),
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  resp.data;
                  updateStateLib(store, `[Set Barbershop services]`, {
                    services: resp.data?.services_connection.nodes,
                  });
                  if (resp.data) {
                    updateStateLib(
                      store,
                      `[Set Barbershop services pagination]`,
                      setPagination(resp.data.services_connection.pageInfo)
                    );
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop services Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    function setBarbershopPaginator(event: PageEvent) {
      updateStateLib(store, `[Get Barbershop services Loading]`, setLoading());
      updateStateLib(store, `[Set Barbershop services filter]`, {
        pagination: {
          page: event.pageIndex + 1,
          pageCount: event.pageSize,
          pageSize: event.pageSize,
          total: event.length,
        },
      });

      return getBarbershopServicesList({
        barbershopDocId: barbershopDocId(),
        serviceName: serviceFilter(),
      });
    }

    function resetPagination(): void {
      updateStateLib(store, `[Reset paginator]`, {
        pagination: {
          ...pagination(),
          page: 1,
        },
      });
    }

    return {
      setBarbershopPaginator,
      getBarbershopServicesList,
      resetPagination,
    };
  })
);
