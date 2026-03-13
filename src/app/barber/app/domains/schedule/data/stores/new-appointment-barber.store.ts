import { signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import {
  EMPTY,
  Observable,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  AlertService,
  ICreateAppointmentParams,
  ICreateAppointmentResponse,
  IFreeSlot,
  INonRegisteredUser,
  IUpdateAppointmentParams,
  IUpdateAppointmentResponse,
  InputPhone,
  UserService,
  UserStore,
  updateStateLib,
} from 'ba-ngrx-signal-based';
import {
  INewBarberAppointmentStore,
  IBarberAppoitmentIdResponse,
  IDetailedView,
  IClientView,
} from '@barber/schedule/data/types';
import { ScheduleService } from '@barber/schedule/data/services';
import { MatDialogRef } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const initialState: INewBarberAppointmentStore = {
  freeSlotsList: [],
  serviceList: [],
  clientList: [],
  selectedSlot: {
    date: '',
    endTime: '',
    startTime: '',
  },
  clientView: IClientView.REGISTERED,
  newClientForm: {
    username: '',
    email: '',
    telephone: null,
  },
  isAccommodationSlotView: false,
  selectedServiceId: null,
  selectedClientId: null,
  nonRegisteredUser: null,
  date: new Date(),
  appointmentEdit: null,
};

export const NewAppointmentBarberStore = signalStore(
  withDevtools('NewAppointment'),
  withState<INewBarberAppointmentStore>(initialState),
  withCallState(),
  withCallState({ collection: 'serviceList' }),
  withCallState({ collection: 'clientList' }),
  withCallState({ collection: 'appointmentCreation' }),
  withMethods((store) => {
    const scheduleService = inject(ScheduleService);
    const alertService = inject(AlertService);
    const userStore = inject(UserStore);
    const userService = inject(UserService);
    const {
      selectedServiceId,
      clientView,
      nonRegisteredUser,
      date,
      selectedClientId,
      appointmentEdit,
      newClientForm,
    } = store;
    const getServiceList = rxMethod<void>(
      concatMap(() => {
        updateStateLib(
          store,
          `[Get service List Loading]`,
          setLoading('serviceList'),
        );
        return scheduleService
          .getServiceList(
            userStore.barber().documentId,
            userStore.barber().barbershopDocId,
          )
          .pipe(
            tapResponse({
              next: (resp) => {
                updateStateLib(store, `[Set service List]`, {
                  serviceList: resp.data?.services,
                });
              },
              error: console.error,
              finalize: () => {
                updateStateLib(
                  store,
                  `[Get service List Loaded]`,
                  setLoaded('serviceList'),
                );
              },
            }),
          );
      }),
    );

    const getClientList = rxMethod<string>(
      pipe(
        distinctUntilChanged(),
        tap(() => {
          updateStateLib(
            store,
            `[Get Client List Loading]`,
            setLoading('clientList'),
          );
        }),
        debounceTime(300),
        switchMap((clientFilter) => {
          return scheduleService
            .getClientList(userStore.barber().barbershopDocId, clientFilter)
            .pipe(
              tapResponse({
                next: (resp) => {
                  updateStateLib(store, `[Set client List]`, {
                    clientList: resp.data?.clients,
                  });
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get client List Loaded]`,
                    setLoaded('clientList'),
                  );
                },
              }),
            );
        }),
      ),
    );

    const createAndEditAppointment = rxMethod<MatDialogRef<unknown>>(
      concatMap((dialogRef) => {
        updateStateLib(
          store,
          `[Appointment Creation Loading]`,
          setLoading('appointmentCreation'),
        );

        const isEditMode = !!appointmentEdit();
        const payload = {
          service: selectedServiceId() as string,
          date: dayjs(date()).format('YYYY-MM-DD'),
          ...(clientView() === IClientView.NON_REGISTERED && {
            nonRegisteredUser: nonRegisteredUser() as INonRegisteredUser,
          }),
          ...(clientView() === IClientView.REGISTERED && {
            client: selectedClientId() as string,
          }),
          barber: userStore.barber().documentId,
          barbershop: userStore.barber().barbershopDocId,
          startTime: dayjs(store.selectedSlot.startTime(), 'HH:mm').format(
            'HH:mm:ss',
          ),
          endTime: dayjs(store.selectedSlot.endTime(), 'HH:mm').format(
            'HH:mm:ss',
          ),
          ...(isEditMode && { appointmentId: appointmentEdit()?.documentId }),
        };

        const appointmentOperation$: Observable<
          Apollo.MutateResult<
            IUpdateAppointmentResponse | ICreateAppointmentResponse
          >
        > = isEditMode
          ? scheduleService.updateAppointment(
              payload as IUpdateAppointmentParams,
            )
          : createAppointment(payload);

        return appointmentOperation$.pipe(
          tapResponse({
            next: (resp) => {
              if (!resp.error) {
                alertService.showSuccess(
                  isEditMode
                    ? 'shared.edit-booking-msg'
                    : 'shared.success-booking-msg',
                );
                const dateString = dayjs(date()).format('YYYY-MM-DD');
                const startTimeString = dayjs(
                  store.selectedSlot.startTime(),
                  'HH:mm',
                ).format('HH:mm:ss');
                const returnModal = dayjs(`${dateString} ${startTimeString}`);
                dialogRef.close(returnModal);
              }
            },
            error: console.error,
            finalize: () => {
              updateStateLib(
                store,
                `[Appointment Creation Loaded]`,
                setLoaded('appointmentCreation'),
              );
            },
          }),
        );
      }),
    );

    const cancelAppointment = rxMethod<MatDialogRef<unknown>>(
      concatMap((dialogRef) => {
        updateStateLib(
          store,
          `[Cancel appointment Loading]`,
          setLoading('appointmentCreation'),
        );
        return scheduleService
          .cancelAppointment(appointmentEdit()!.documentId)
          .pipe(
            tapResponse({
              next: (resp) => {
                if (!resp?.error) {
                  alertService.showSuccess('shared.cancel-booking-msg');
                  const dateString = dayjs(date()).format('YYYY-MM-DD');
                  const startTimeString = dayjs(
                    store.selectedSlot.startTime(),
                    'HH:mm',
                  ).format('HH:mm:ss');
                  const returnModal = dayjs(`${dateString} ${startTimeString}`);
                  dialogRef.close({
                    date: returnModal,
                    view: IDetailedView.CANCEL,
                  });
                }
              },
              error: console.error,
              finalize: () => {
                updateStateLib(
                  store,
                  `[Cancel appointment Loaded]`,
                  setLoaded('appointmentCreation'),
                );
              },
            }),
          );
      }),
    );

    function setSeletedSlot(selectedSlot: IFreeSlot): void {
      updateStateLib(store, '[Set selected slot]', {
        selectedSlot: selectedSlot,
      });
    }

    const setSeletedClient = rxMethod<string | null>(
      pipe(
        tap((clientId) =>
          updateStateLib(store, '[Set selected client]', {
            selectedClientId: clientId,
          }),
        ),
      ),
    );

    const setNonRegisteredClient = rxMethod<Partial<INonRegisteredUser>>(
      pipe(
        debounceTime(300),
        tap((nonRegisteredUser) =>
          updateStateLib(store, '[Set nonRegistered client]', {
            nonRegisteredUser: {
              ...(nonRegisteredUser as INonRegisteredUser),
            },
          }),
        ),
      ),
    );

    const setAccommodationSlotTime = rxMethod<{
      accomodationForm: Partial<{ startTime: string; endTime: string }>;
      dateForm: Date;
    }>(
      pipe(
        debounceTime(300),
        tap(({ dateForm }) => {
          updateStateLib(store, '[Set date by accommodation]', {
            date: dateForm,
          });
        }),
        tap(({ accomodationForm }) => {
          const newSlot = {
            date: date() || '',
            endTime: accomodationForm.endTime,
            startTime: accomodationForm.startTime,
          };

          updateStateLib(store, '[Set slot by AccommodationSlotTime]', {
            selectedSlot: newSlot as IFreeSlot,
          });
        }),
      ),
    );

    const setNewClient = rxMethod<
      Partial<{
        telephone: null | InputPhone;
        username: string;
        email: string;
      }>
    >(
      pipe(
        debounceTime(300),
        tap((userForm) => {
          updateStateLib(store, '[Set new client form]', {
            newClientForm: {
              ...newClientForm(),
              ...userForm,
            },
          });
        }),
      ),
    );

    const getFreeSlots = rxMethod<
      Partial<{
        serviceId: string;
        date: Date;
      }>
    >(
      pipe(
        tap(() =>
          updateStateLib(store, `[Get Free slots Loading]`, setLoading()),
        ),
        debounceTime(300),
        switchMap((freeSlotForm) => {
          setSelectedServiceId(freeSlotForm.serviceId);
          setDate(freeSlotForm.date);
          if (freeSlotForm.serviceId && freeSlotForm.date) {
            return scheduleService
              .getFreeSlots({
                barberId: userStore.barber().documentId,
                barbershopId: userStore.barber().barbershopDocId,
                serviceId: selectedServiceId() as string,
                date: dayjs(freeSlotForm.date).format('YYYY-MM-DD'),
              })
              .pipe(
                tapResponse({
                  next: (resp) => {
                    clearSelectedSlot();
                    if (
                      appointmentEdit()?.service?.documentId ==
                        selectedServiceId() &&
                      appointmentEdit()?.date ==
                        dayjs(date()).format('YYYY-MM-DD')
                    ) {
                      const previousSlot = {
                        date: appointmentEdit()!.date,
                        endTime: dayjs(
                          appointmentEdit()?.endTime,
                          'HH:mm:ss',
                        ).format('HH:mm'),
                        startTime: dayjs(
                          appointmentEdit()?.startTime,
                          'HH:mm:ss',
                        ).format('HH:mm'),
                      };
                      const updatedResp = [
                        ...(resp?.data?.freeSlotsByProfessional || []),
                      ];
                      updatedResp.unshift(previousSlot);

                      updateStateLib(store, '[Set Free slots]', {
                        freeSlotsList: updatedResp || [],
                      });
                    } else {
                      updateStateLib(store, '[Set Free slots]', {
                        freeSlotsList:
                          resp?.data?.freeSlotsByProfessional || [],
                      });
                    }
                  },
                  error: console.error,
                  finalize: () => {
                    updateStateLib(
                      store,
                      `[Get Free slots Loaded]`,
                      setLoaded(),
                    );
                  },
                }),
              );
          } else {
            updateStateLib(store, `[Set Free slots]`, {
              freeSlotsList: [],
            });
            updateStateLib(store, `[Get Free slots Loaded]`, setLoaded());
            return of([]);
          }
        }),
      ),
    );

    function setSelectedServiceId(serviceId: string | null | undefined): void {
      updateStateLib(store, '[Set Selected Service]', {
        selectedServiceId: serviceId,
      });
    }

    function setClientView(view: IClientView): void {
      updateStateLib(store, '[Set client view]', {
        clientView: view,
      });
    }

    function setSlotView(value: boolean): void {
      updateStateLib(store, '[Set slot view]', {
        isAccommodationSlotView: value,
      });
    }

    function setDate(date: Date | null | undefined): void {
      updateStateLib(store, '[Set date]', {
        date: date,
      });
    }

    function clearSelectedSlot(): void {
      updateStateLib(store, '[Clear selected slot]', {
        selectedSlot: {
          date: '',
          endTime: '',
          startTime: '',
        },
      });
    }

    function createAppointment(appointmentPayload: ICreateAppointmentParams) {
      const isNewClient = clientView() === IClientView.NEW_CLIENT;

      const createClient$ = isNewClient
        ? userService
            .createUser({
              data: {
                email: newClientForm().email,
                password: `${userStore.barber().barbershopSlug}_new_client`,
                role: '1',
                telephone: newClientForm().telephone as InputPhone,
                username: newClientForm().username,
                barbershopDocId: userStore.barber().barbershopDocId,
                isCreatingClient: true,
              },
            })
            .pipe(
              map((resp) => ({
                mustCreate: true,
                appointmentPayload,
                clientId: resp.data?.createUsersPermissionsUser.data.documentId,
              })),
            )
        : of({
            appointmentPayload,
            mustCreate: false,
            clientId: '',
          });

      return createClient$.pipe(
        switchMap(({ appointmentPayload, mustCreate, clientId }) => {
          if (mustCreate && !clientId?.length) {
            return EMPTY;
          }

          return scheduleService.bookAppointment({
            ...appointmentPayload,
            ...(mustCreate && { client: clientId }),
          });
        }),
      );
    }

    function getAppointmentById(
      appointmentId: string,
    ): Observable<Apollo.QueryResult<IBarberAppoitmentIdResponse>> {
      updateStateLib(store, `[Get Appointment edit Loading]`, setLoading());
      return scheduleService.getAppointmentById(appointmentId).pipe(
        tapResponse({
          next: (resp) => {
            updateStateLib(store, '[Set appointment edit]', {
              appointmentEdit: resp?.data?.appointment,
            });
          },
          error: console.error,
          finalize: () => {
            updateStateLib(store, `[Get Appointment edit Loaded]`, setLoaded());
          },
        }),
      );
    }

    return {
      clearSelectedSlot,
      setDate,
      setSlotView,
      setClientView,
      setSelectedServiceId,
      setSeletedSlot,
      getAppointmentById,
      setNewClient,
      setAccommodationSlotTime,
      setNonRegisteredClient,
      setSeletedClient,
      cancelAppointment,
      getServiceList,
      getClientList,
      createAndEditAppointment,
      getFreeSlots,
    };
  }),
);
