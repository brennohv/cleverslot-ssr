import {
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
import {
  catchError,
  debounceTime,
  map,
  of,
  pipe,
  switchMap,
  tap,
  throwError,
  Unsubscribable,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  AlertService,
  UserStore,
  updateStateLib,
  withPaginationState,
  setPagination,
  UploadFileService,
  UserService,
} from 'ba-ngrx-signal-based';
import { BarbershopConfigBarberService } from '../services';
import { IAddNewEmployeeParams, IBarbershopConfigBarberStore } from '../types';
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

const initialState: IBarbershopConfigBarberStore = {
  barbers: [],
  userAsProfessionalView: false,
  barbershopSubscriptionPlan: null,
};

export const BarbershopConfigBarberStore = signalStore(
  withPaginationState(),
  withDevtools('BarbershopConfigBarberStore'),
  withState<IBarbershopConfigBarberStore>(initialState),
  withCallState(),
  withComputed(({ barbers, barbershopSubscriptionPlan }) => ({
    canCreateMoreEmployees: computed(() => {
      if (!barbershopSubscriptionPlan()) {
        return false;
      }
      switch (barbershopSubscriptionPlan()) {
        case 'BASIC':
          return !barbers().length;

        case 'ENTERPRISE':
          return barbers().length < 5 ? true : false;

        default:
          return false;
      }
    }),
  })),
  withMethods((store) => {
    const { pagination, barbers, userAsProfessionalView } = store;
    const barbershopConfigBarberService = inject(BarbershopConfigBarberService);
    const uploadFileService = inject(UploadFileService);
    const userStore = inject(UserStore);
    const userService = inject(UserService);
    const alertService = inject(AlertService);

    const getBarbershopBarber = rxMethod<void>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Get Barbershop barbers Loading]`,
            setLoading()
          )
        ),
        debounceTime(300),
        switchMap(() => {
          return barbershopConfigBarberService
            .getBarbershopBarbers({
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
                  updateStateLib(store, `[Set Barbershop barbers]`, {
                    barbers: resp.data.barbers_connection.nodes,
                  });
                  updateStateLib(
                    store,
                    `[Set Barbershop barbers pagination]`,
                    setPagination(resp.data?.barbers_connection.pageInfo)
                  );
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop barbers Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    const addNewBarber = rxMethod<IAddNewEmployeeParams>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Add new barber loading]`, setLoading())
        ),
        debounceTime(300),
        switchMap((params) => {
          if (params.photo) {
            return uploadFileService.uploadFile({ file: params.photo }).pipe(
              map((resp) => ({ fileResp: resp, params })),
              catchError(() => of({ fileResp: [], params }))
            );
          }

          return of({ fileResp: [], params });
        }),
        switchMap(({ fileResp, params }) => {
          if (userAsProfessionalView()) {
            return of({
              createUserResp: {
                data: {
                  createUsersPermissionsUser: {
                    data: {
                      documentId: userStore.documentId(),
                    },
                  },
                },
              },
              params,
            });
          }

          const { email, password, telephone, username } = params;
          return userService
            .createUser({
              data: {
                email: email,
                password: password,
                role: '1',
                telephone: telephone,
                username: username,
                ...(fileResp.length && { photo: fileResp[0].id }),
                barbershopDocId: userStore.admin().barbershopDocId,
              },
            })
            .pipe(
              map((createUserResp) => ({ createUserResp, params })),
              catchError((err) => {
                params.dialogRef.close();
                return throwError(() => err);
              })
            );
        }),
        switchMap(({ createUserResp, params }) => {
          const { firstName, lastName } = params;
          if (!createUserResp.data) {
            return of();
          }

          return barbershopConfigBarberService
            .createBarber({
              data: {
                barbershop: userStore.admin().barbershopDocId,
                userBarber:
                  createUserResp.data.createUsersPermissionsUser.data
                    .documentId,
                firstName,
                lastName,
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp?.data?.createBarber?.documentId) {
                    updateStateLib(store, `[Set new barbers]`, {
                      barbers: [...barbers(), { ...resp?.data?.createBarber }],
                      pagination: {
                        ...pagination(),
                        total: pagination.total() + 1,
                      },
                    });

                    if (userAsProfessionalView()) {
                      userStore.updateUserBarber(
                        {
                          documentId: resp?.data?.createBarber?.documentId,
                          barbershopDocId: userStore.admin().barbershopDocId,
                          barbershopSlug: userStore.admin().barbershopSlug,
                        },
                        '[Add my user as Professional]'
                      );
                    }

                    alertService.showSuccess('shared.general-success-create');
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(store, `[Add new barber loaded]`, setLoaded());
                  params.dialogRef.close();
                },
              })
            );
        })
      )
    );

    const deleteBarber = rxMethod<string>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Delete Barber loading]`, setLoading())
        ),
        debounceTime(300),
        switchMap((barberDocId: string) => {
          return barbershopConfigBarberService.deleteBarber(barberDocId).pipe(
            tapResponse({
              next: (resp) => {
                if (resp?.data?.deleteBarber?.documentId) {
                  updateStateLib(store, `[Delete Barber set]`, {
                    barbers: [
                      ...barbers().filter(
                        (barber) => barber.documentId !== barberDocId
                      ),
                    ],
                    pagination: {
                      ...pagination(),
                      total: pagination.total() - 1,
                    },
                  });

                  if (barberDocId === userStore.barber().documentId) {
                    userStore.updateUserBarber(
                      null,
                      '[Delete my user as Professional]'
                    );
                  }

                  alertService.showSuccess('shared.general-success-delete');
                }
              },
              error: console.error,
              finalize: () => {
                updateStateLib(store, `[Delete Barber loaded]`, setLoaded());
              },
            })
          );
        })
      )
    );

    const updateValidatorBasedOnView = rxMethod<{
      userAsProfessionalView: boolean;
      formGroup: FormGroup;
    }>(
      pipe(
        tap(({ userAsProfessionalView, formGroup }) => {
          updateStateLib(store, 'userAsProfessionalView changed', {
            userAsProfessionalView,
          });
          const requiredControlsDefaultView = [
            'password',
            'telephone',
            'username',
            'email',
          ];
          const defaultFormControlKeys = Object.keys(formGroup.controls);
          defaultFormControlKeys.map((control) => {
            if (requiredControlsDefaultView.includes(control)) {
              const currentControl = formGroup.get(control);
              userAsProfessionalView
                ? currentControl?.removeValidators(Validators.required)
                : currentControl?.addValidators(Validators.required);
              formGroup.get(control)?.updateValueAndValidity();
            }
          });
        })
      )
    );

    function setBarbershopPaginator(event: PageEvent) {
      updateStateLib(store, `[Get Barbershop barber Loading]`, setLoading());
      updateStateLib(store, `[Set Barbershop barbers filter]`, {
        pagination: {
          page: event.pageIndex + 1,
          pageCount: event.pageSize,
          pageSize: event.pageSize,
          total: event.length,
        },
      });

      return getBarbershopBarber();
    }

    const getBarbershopPlan = rxMethod<void>(
      pipe(
        switchMap(() => {
          return barbershopConfigBarberService
            .getBarbershopSubscriptionPlan({
              barbershopId: userStore.admin().barbershopDocId,
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp.data?.barbershop?.subscriptionPlan) {
                    updateStateLib(store, 'Set barbershopPlan', {
                      barbershopSubscriptionPlan:
                        resp.data.barbershop.subscriptionPlan,
                    });
                  }
                },
                error: console.error,
              })
            );
        })
      )
    );

    return {
      getBarbershopBarber,
      addNewBarber,
      deleteBarber,
      updateValidatorBasedOnView,
      setBarbershopPaginator,
      getBarbershopPlan,
    };
  }),

  withHooks({
    onInit(store) {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        store.getBarbershopBarber();
        store.getBarbershopPlan();
      }
    },
  })
);
