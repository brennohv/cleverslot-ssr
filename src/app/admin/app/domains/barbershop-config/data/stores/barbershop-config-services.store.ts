import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject, PLATFORM_ID } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import {
  catchError,
  debounceTime,
  map,
  Observable,
  of,
  pipe,
  switchMap,
  tap,
  Unsubscribable,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  AlertService,
  UploadFileService,
  UserStore,
  setPagination,
  updateStateLib,
  withPaginationState,
} from 'ba-ngrx-signal-based';
import { PageEvent } from '@angular/material/paginator';
import { BarbershopConfigServiceService } from '../services';
import {
  IBarbershopConfigService,
  IBarbershopConfigServicesStore,
  ICreateServiceResponse,
  INewServiceDialog,
  IUpdateServiceResponse,
  IUpdateServiceSetupParams,
} from '../types';
import { Apollo } from 'apollo-angular';
import { isPlatformBrowser } from '@angular/common';

const initialState: IBarbershopConfigServicesStore = {
  services: [],
  allProfessionals: [],
  serviceFilter: '',
};

export const BarbershopConfigServicesStore = signalStore(
  withPaginationState(),
  withDevtools('BarbershopConfigServicesStore'),
  withState<IBarbershopConfigServicesStore>(initialState),
  withCallState(),
  withCallState({ collection: 'allProfessionals' }),
  withMethods((store) => {
    const barbershopConfigService = inject(BarbershopConfigServiceService);
    const userStore = inject(UserStore);
    const alertService = inject(AlertService);
    const uploadFileService = inject(UploadFileService);
    const I18N_PREFFIX = 'mfAdmin.barbershop-config.config-services.';
    const { pagination, services, serviceFilter } = store;

    const getBarbershopServicesList = rxMethod<string>(
      pipe(
        tap((serviceName) => {
          updateStateLib(
            store,
            `[Get Barbershop services Loading]`,
            setLoading()
          );
          updateStateLib(store, `[Set Barbershop client identifier]`, {
            serviceFilter: serviceName,
          });
        }),
        debounceTime(300),
        switchMap(() => {
          return barbershopConfigService
            .getBarbershopServiceList({
              serviceName: serviceFilter(),
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
                  updateStateLib(store, `[Set Barbershop services]`, {
                    services: resp.data.services_connection.nodes.map(
                      (service) =>
                        ({
                          name: service.name,
                          photo: service.photo,
                          documentId: service.documentId,
                          professionalPercentage:
                            service.professionalPercentage,
                          duration: service.duration,
                          recurrency: service.recurrency,
                          _value: `${
                            service.recurrency
                          } ${service.value.toFixed(2)}`,
                          value: service.value,
                          isActive: service.isActive,
                          lucro: `${service.recurrency} ${(
                            service.value -
                            (service.value * service.professionalPercentage) /
                              100
                          ).toFixed(2)}`,
                          barbers: service.barbers,
                        } as IBarbershopConfigService)
                    ),
                  });
                  updateStateLib(
                    store,
                    `[Set Barbershop services pagination]`,
                    setPagination(resp.data.services_connection.pageInfo)
                  );
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

    const getAllBarbers = rxMethod<void>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Get Barbershop barbers Loading]`,
            setLoading('allProfessionals')
          )
        ),
        debounceTime(300),
        switchMap(() => {
          return barbershopConfigService
            .getAllProfessionals(userStore.admin().barbershopDocId)
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (!resp.data) return;
                  updateStateLib(store, `[Set Barbershop barbers]`, {
                    allProfessionals: resp.data.barbers,
                  });
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop barbers Loaded]`,
                    setLoaded('allProfessionals')
                  );
                },
              })
            );
        })
      )
    );

    const enableDisableService = rxMethod<IBarbershopConfigService>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Update isActive service Loading]`,
            setLoading()
          )
        ),
        debounceTime(300),
        switchMap((service: IBarbershopConfigService) => {
          return barbershopConfigService
            .enableDisableService(service.documentId, !service.isActive)
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp?.data?.updateService?.documentId) {
                    const { documentId, isActive } = service;

                    const newService = services().map((existingService) =>
                      existingService.documentId === documentId
                        ? { ...existingService, isActive: !isActive }
                        : existingService
                    );
                    updateStateLib(store, `[Set isActive service]`, {
                      services: newService,
                    });
                    alertService.showSuccess(
                      I18N_PREFFIX + (isActive ? 'disable-msg' : 'enable-msg')
                    );
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Update isActive service Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    const updateServiceSetup = rxMethod<IUpdateServiceSetupParams>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Update service Loading]`, setLoading())
        ),
        debounceTime(300),
        switchMap((newService: IUpdateServiceSetupParams) => {
          if (newService.photo) {
            return uploadFileService
              .uploadFile({ file: newService.photo })
              .pipe(
                map((fileResp) => {
                  const [serviceImg] = fileResp;
                  return { newService: newService, fileId: serviceImg.id };
                }),
                catchError(() => {
                  alertService.showError('Upload image did not work');
                  return of({ newService: newService, fileId: null });
                })
              );
          }

          return of({ newService: newService, fileId: null });
        }),
        switchMap(({ newService, fileId }) => {
          return updateService(newService, fileId).pipe(
            tapResponse({
              next: (resp) => {
                if (resp?.data?.updateService?.documentId) {
                  const updatedService = resp.data.updateService;
                  const {
                    documentId,
                    recurrency,
                    value,
                    professionalPercentage,
                  } = updatedService;

                  const newServiceList = services().map((existingService) =>
                    existingService.documentId === documentId
                      ? {
                          ...existingService,
                          ...resp.data!.updateService,
                          _value: `${recurrency} ${value.toFixed(2)}`,
                          lucro: `${recurrency} ${(
                            value -
                            (value * professionalPercentage) / 100
                          ).toFixed(2)}`,
                        }
                      : existingService
                  );
                  updateStateLib(store, `[Set new service list]`, {
                    services: newServiceList,
                  });
                  alertService.showSuccess('shared.general-success-update');
                }
              },
              error: console.error,
              finalize: () => {
                updateStateLib(store, `[Update service Loaded]`, setLoaded());
              },
            })
          );
        })
      )
    );

    const createServiceSetup = rxMethod<INewServiceDialog>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Update service Loading]`, setLoading())
        ),
        debounceTime(300),
        switchMap((service: INewServiceDialog) => {
          if (service.photo) {
            return uploadFileService.uploadFile({ file: service.photo }).pipe(
              map((fileResp) => {
                const [serviceImg] = fileResp;
                return { service, fileId: serviceImg.id };
              }),
              catchError(() => {
                alertService.showError('Upload image did not work');
                return of({ service, fileId: null });
              })
            );
          }

          return of({ service, fileId: null });
        }),
        switchMap(({ fileId, service }) => {
          return createService(service, fileId).pipe(
            tapResponse({
              next: (resp) => {
                if (resp.data?.createService?.documentId) {
                  const createService = resp.data.createService;
                  const newService = {
                    name: createService.name,
                    photo: createService.photo,
                    documentId: createService.documentId,
                    professionalPercentage:
                      createService.professionalPercentage,
                    duration: createService.duration,
                    recurrency: createService.recurrency,
                    _value: `${
                      createService.recurrency
                    } ${createService.value!.toFixed(2)}`,
                    value: createService.value,
                    isActive: createService.isActive,
                    lucro: `${createService.recurrency} ${(
                      createService.value! -
                      (createService.value! *
                        createService.professionalPercentage!) /
                        100
                    ).toFixed(2)}`,
                  } as IBarbershopConfigService;

                  updateStateLib(store, `[Set new service service]`, {
                    services: services().concat(newService),
                    pagination: {
                      ...pagination(),
                      total: pagination.total() + 1,
                    },
                  });
                  alertService.showSuccess('shared.general-success-update');
                }
              },
              error: console.error,
              finalize: () => {
                updateStateLib(store, `[Update service Loaded]`, setLoaded());
              },
            })
          );
        })
      )
    );

    function createService(
      service: INewServiceDialog,
      fileId: string | null
    ): Observable<Apollo.MutateResult<ICreateServiceResponse>> {
      return barbershopConfigService.createService({
        barbershopDocId: userStore.admin().barbershopDocId,
        duration: service.duration,
        name: service.name,
        professionalPercentage: service.professionalPercentage,
        recurrency: service.recurrency,
        value: service.value,
        barbers: service.barbers.map((barber) => barber.documentId),
        ...(fileId && { fileId }),
      });
    }

    function updateService(
      newService: IUpdateServiceSetupParams,
      fileId: string | null
    ): Observable<Apollo.MutateResult<IUpdateServiceResponse>> {
      return barbershopConfigService.updateService({
        documentId: newService.documentId,
        duration: newService.duration,
        isActive: newService.isActive,
        name: newService.name,
        professionalPercentage: newService.professionalPercentage,
        recurrency: newService.recurrency,
        value: newService.value,
        barbers: newService.barbers.map((barber) => barber.documentId),
        ...(fileId && { fileId }),
      });
    }

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
      enableDisableService,
      updateServiceSetup,
      createServiceSetup,
      getAllBarbers,
      resetPagination,
    };
  }),
  withHooks({
    onInit({ getBarbershopServicesList, serviceFilter }) {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        getBarbershopServicesList(serviceFilter());
      }
    },
  })
);
