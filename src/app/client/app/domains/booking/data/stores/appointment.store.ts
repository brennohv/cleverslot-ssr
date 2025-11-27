import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import {
  distinctUntilChanged,
  exhaustMap,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  AlertService,
  UserStore,
  setPagination,
  updateStateLib,
  withPaginationState,
  IStatus,
} from 'ba-ngrx-signal-based';
import { AppointmentService } from '@client/booking/data/services';
import { IAppointmentListStore } from '@client/booking/data/types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const initialState: IAppointmentListStore = {
  appointments: [],
  filter: {
    startDate: new Date(),
    page: 1,
  },
};

export const AppointmenteListStore = signalStore(
  withDevtools('appointmentList'),
  withState<IAppointmentListStore>(initialState),
  withCallState(),
  withCallState({ collection: 'getMore' }),
  withPaginationState(),
  withMethods((store) => {
    const { filter, appointments } = store;
    const appointmentService = inject(AppointmentService);
    const userStore = inject(UserStore);
    return {
      getAppointmentList: rxMethod<
        Partial<{
          startDate: Date;
          endDate: Date | undefined;
        }>
      >(
        pipe(
          tap(() =>
            updateStateLib(
              store,
              `[Get Appointment List loading]`,
              setLoading()
            )
          ),
          distinctUntilChanged(),
          switchMap((form) => {
            if (!!form.startDate && dayjs(form.startDate).isValid()) {
              updateStateLib(store, '[Set filter]', {
                filter: {
                  page: 1,
                  startDate: form.startDate as Date,
                  endDate: form.endDate,
                },
              });

              return appointmentService
                .appointmentsByUserId({
                  userId: userStore.documentId(),
                  startDate: dayjs(form.startDate).format('YYYY-MM-DD'),
                  pagination: {
                    pageSize: 10,
                    page: filter.page(),
                  },
                  sort: ['date:asc', 'startTime:asc'],
                  ...(filter()?.endDate &&
                    dayjs(filter()?.endDate).isValid() && {
                      endDate: dayjs(filter()?.endDate).format('YYYY-MM-DD'),
                    }),
                })

                .pipe(
                  tapResponse({
                    next: (resp) => {
                      if (!resp.data) return;

                      updateStateLib(store, `[Set Appointment List]`, {
                        appointments: resp.data.appointments_connection.nodes,
                      });
                      patchState(
                        store,
                        setPagination(
                          resp.data.appointments_connection.pageInfo
                        )
                      );
                    },
                    error: console.error,
                    finalize: () => {
                      updateStateLib(
                        store,
                        `[Get Appointment List loaded]`,
                        setLoaded()
                      );
                    },
                  })
                );
            } else {
              updateStateLib(store, `[Set Appointment List]`, {
                appointments: [],
              });
              updateStateLib(
                store,
                `[Get Appointment List loaded]`,
                setLoaded()
              );
              return of([]);
            }
          })
        )
      ),
      getMoreAppointmentList: rxMethod<void>(
        exhaustMap(() => {
          updateStateLib(
            store,
            `[Get More Appointment List ]`,
            setLoading('getMore')
          );
          return appointmentService
            .appointmentsByUserId({
              userId: userStore.documentId(),
              startDate: dayjs(filter().startDate).format('YYYY-MM-DD'),
              ...(filter()?.endDate &&
                dayjs(filter()?.endDate).isValid() && {
                  endDate: dayjs(filter()?.endDate).format('YYYY-MM-DD'),
                }),
              sort: ['date:asc', 'startTime:asc'],
              pagination: {
                pageSize: 10,
                page: filter.page(),
              },
            })

            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp.data?.appointments_connection?.nodes) {
                    updateStateLib(store, `[Set Appointment List]`, {
                      appointments: appointments().concat(
                        resp.data.appointments_connection.nodes
                      ),
                    });
                    updateStateLib(
                      store,
                      '[Set pagination]',
                      setPagination(resp.data.appointments_connection.pageInfo)
                    );
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Appointment List loaded]`,
                    setLoaded('getMore')
                  );
                },
              })
            );
        })
      ),
      updateAppointmentBasedOnCancelModal(appointmentId: string): void {
        patchState(store, {
          appointments: appointments().map((appointment) => {
            if (appointment.documentId === appointmentId) {
              return {
                ...appointment,
                appointmentStatus: IStatus.CANCELED,
              };
            }
            return appointment;
          }),
        });
      },
    };
  }),
  withMethods((store) => {
    const appointmentService = inject(AppointmentService);
    const alertService = inject(AlertService);
    const { filter } = store;
    return {
      setNextPage: () => {
        updateStateLib(store, '[Set filter page]', {
          filter: {
            ...filter(),
            page: filter.page() + 1,
          },
        });
        store.getMoreAppointmentList();
      },
      cancelAppointment: rxMethod<string>(
        exhaustMap((appointmentId) => {
          updateStateLib(store, `[Cancel Appointment Loading]`, setLoading());
          return appointmentService.cancelAppointment(appointmentId).pipe(
            tapResponse({
              next: (resp) => {
                if (!resp.error) {
                  store.updateAppointmentBasedOnCancelModal(appointmentId);
                  alertService.showSuccess('shared.cancel-booking-msg');
                }
              },
              error: console.error,
              finalize: () => {
                updateStateLib(
                  store,
                  `[Cancel Appointment loaded]`,
                  setLoaded()
                );
              },
            })
          );
        })
      ),
    };
  }),
  withComputed(({ pagination: { total }, appointments }) => ({
    hasMoreDataFromService: computed(() => {
      return total() > appointments()?.length;
    }),
  }))
);
