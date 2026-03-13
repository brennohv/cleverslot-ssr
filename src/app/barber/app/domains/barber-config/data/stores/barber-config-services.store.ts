import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { debounceTime, pipe, switchMap, tap, Unsubscribable } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  AlertService,
  UserStore,
  setPagination,
  updateStateLib,
  withPaginationState,
} from 'ba-ngrx-signal-based';
import { IBarberConfigServicesStore } from '@barber/barber-config/data/types';
import { BarberConfigService } from '@barber/barber-config/data/services';
import { BarberConfigStore } from './barber-config.store';
import { PageEvent } from '@angular/material/paginator';

const initialState: IBarberConfigServicesStore = {
  services: [],
  serviceFilter: '',
};

export const BarberConfigServicesStore = signalStore(
  withPaginationState(),
  withDevtools('BarberConfigServicesStore'),
  withState<IBarberConfigServicesStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const barberConfigService = inject(BarberConfigService);
    const barberConfigStore = inject(BarberConfigStore);
    const userStore = inject(UserStore);
    const alertService = inject(AlertService);
    const { pagination, serviceFilter } = store;

    const getBarbershopServicesList = rxMethod<string>(
      pipe(
        tap((serviceName) => {
          updateStateLib(
            store,
            `[Get Barbershop services Loading]`,
            setLoading(),
          );

          updateStateLib(store, `[Set Barbershop client identifier]`, {
            serviceFilter: serviceName,
          });
        }),
        debounceTime(300),
        switchMap(() => {
          return barberConfigService
            .getBarbershopServiceList({
              serviceName: serviceFilter(),
              barbershopId: userStore.barber().barbershopDocId,
              pagination: {
                pageSize: pagination.pageSize(),
                page: pagination.page(),
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  updateStateLib(store, `[Set Barbershop services]`, {
                    services: resp?.data?.services_connection.nodes.map(
                      (service) => ({
                        name: service.name,
                        photo: service.photo,
                        documentId: service.documentId,
                        professionalPercentage: service.professionalPercentage,
                        duration: service.duration,
                        value: `${service.recurrency} ${service.value}`,
                        checked: barberConfigStore.barber
                          .services()
                          .some(
                            (serviceFromBaberConfig) =>
                              serviceFromBaberConfig.documentId ===
                              service.documentId,
                          ),
                      }),
                    ),
                  });
                  if (resp?.data?.services_connection.pageInfo) {
                    updateStateLib(
                      store,
                      `[Set Barbershop services pagination]`,
                      setPagination(resp.data.services_connection.pageInfo),
                    );
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop services Loaded]`,
                    setLoaded(),
                  );
                },
              }),
            );
        }),
      ),
    );

    const updateBarberServices = rxMethod<string>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Update Barber services Loading]`,
            setLoading(),
          ),
        ),
        debounceTime(300),
        switchMap((serviceId) => {
          const shouldRemoveService = store
            .services()
            .some(
              (service) => service.documentId === serviceId && service.checked,
            );
          const newServiceList = shouldRemoveService
            ? barberConfigStore.barber
                .services()
                .filter((service) => service.documentId !== serviceId)
            : barberConfigStore.barber
                .services()
                .concat({ documentId: serviceId });

          return barberConfigService
            .updateBarberServices({
              barberId: userStore.barber().documentId,
              data: {
                services: newServiceList.map((service) => service.documentId),
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  updateStateLib(store, `[Set Barbershop services]`, {
                    services: store.services().map((service) => {
                      const isServiceUpdated =
                        resp.data?.updateBarber.services?.some(
                          (serviceResp) =>
                            serviceResp.documentId === service.documentId,
                        );

                      return {
                        ...service,
                        checked: !!isServiceUpdated,
                      };
                    }),
                  });

                  barberConfigStore.updateServiceList(
                    resp.data?.updateBarber.services.map((service) => ({
                      documentId: service.documentId,
                    })) || [],
                  );
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop services Loaded]`,
                    setLoaded(),
                  );

                  alertService.showSuccess('shared.general-success-update');
                },
              }),
            );
        }),
      ),
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

      return getBarbershopServicesList(serviceFilter());
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
      updateBarberServices,
      resetPagination,
    };
  }),
  withHooks({
    onInit({ getBarbershopServicesList, serviceFilter }) {
      getBarbershopServicesList(serviceFilter());
    },
  }),
);
