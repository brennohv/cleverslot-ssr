import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject, PLATFORM_ID } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { BarbershopListService } from '@client/barbershop-search/data/services';
import {
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { ISearchBarbershopStore } from '@client/barbershop-search/data/types';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  setPagination,
  updateStateLib,
  withPaginationState,
  IPagination,
} from 'ba-ngrx-signal-based';
import { isPlatformBrowser } from '@angular/common';
import { IBarbershopSearch } from '@client/barbershop-search/data/types';

const initialState: ISearchBarbershopStore = {
  barbershops: [],
  filter: {
    name: '',
    page: 1,
  },
};

export const SearchBarbershopStore = signalStore(
  withDevtools('barbershopList'),
  withState<ISearchBarbershopStore>(initialState),
  withPaginationState(),
  withCallState(),
  withCallState({ collection: 'getMore' }),
  withMethods((store) => {
    const barbershopListService = inject(BarbershopListService);
    const { filter, barbershops } = store;
    return {
      getBarbershopList: rxMethod<string>(
        pipe(
          debounceTime(300),
          tap(() =>
            updateStateLib(store, `[Get Barbershop List Loading]`, setLoading())
          ),
          distinctUntilChanged(),
          switchMap((name) => {
            return barbershopListService
              .getBarberShopList(name, { page: filter.page(), pageSize: 10 })
              .pipe(
                tapResponse({
                  next: (resp) => {
                    updateStateLib(store, `[Set Barbershop List]`, {
                      barbershops: resp.data?.barbershops_connection.nodes,
                    });
                    if (resp.data) {
                      patchState(
                        store,
                        setPagination(
                          resp.data?.barbershops_connection.pageInfo
                        )
                      );
                    }
                  },
                  error: console.error,
                  finalize: () => {
                    updateStateLib(
                      store,
                      `[Get Barbershop Loaded]`,
                      setLoaded()
                    );
                  },
                })
              );
          })
        )
      ),
      getMoreBarbershopList: rxMethod<void>(
        exhaustMap(() => {
          updateStateLib(
            store,
            `[Get More Barbershop Loading]`,
            setLoading('getMore')
          );
          return barbershopListService
            .getBarberShopList(filter.name(), {
              page: filter.page(),
              pageSize: 10,
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp.data) {
                    updateStateLib(store, `[Set more Barbershop List]`, {
                      barbershops: barbershops().concat(
                        resp.data?.barbershops_connection.nodes
                      ),
                    });
                    patchState(
                      store,
                      setPagination(resp.data?.barbershops_connection.pageInfo)
                    );
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get More Barbershop List Loaded]`,
                    setLoaded('getMore')
                  );
                },
              })
            );
        })
      ),
      setNameFilter: (name: string) => {
        patchState(store, {
          filter: {
            ...filter(),
            page: 1,
            name,
          },
        });
      },
      setInitialLoading: () => {
        updateStateLib(
          store,
          `[Search Barbershop Initial loading]`,
          setLoading()
        );
      },
      initializeWithResolvedData: (
        barbershops: IBarbershopSearch[],
        pageInfo: IPagination
      ) => {
        updateStateLib(store, `[Initialize with resolved data]`, {
          barbershops,
        });
        patchState(store, setPagination(pageInfo), setLoaded());
      },
    };
  }),
  withMethods((store) => {
    const { filter } = store;
    return {
      setNextPage: () => {
        patchState(store, {
          filter: {
            ...filter(),
            page: filter.page() + 1,
          },
        });
        store.getMoreBarbershopList();
      },
    };
  }),
  withComputed(({ pagination: { total }, barbershops }) => ({
    hasMoreDataFromService: computed(() => {
      return total() > barbershops()?.length;
    }),
  }))
);
