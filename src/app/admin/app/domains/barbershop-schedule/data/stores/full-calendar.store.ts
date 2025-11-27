import { signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { debounceTime, forkJoin, Observable, pipe, switchMap, tap } from 'rxjs';
import { ScheduleService } from '@admin/barbershop-schedule/data/services';
import {
  IBarberAppointmentsResponse,
  IBarberBlockersResponse,
  ICalendarEvents,
  IFullCalendarStore,
} from '@admin/barbershop-schedule/data/types';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  AlertService,
  CustomToastComponentComponent,
  updateStateLib,
} from 'ba-ngrx-signal-based';
import { Apollo } from 'apollo-angular';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const initialState: IFullCalendarStore = {
  professionalId: '',
  calendarEvents: [],
  filter: {
    date: new Date(),
  },
};

export const FullCalendarStore = signalStore(
  withDevtools('FullCalendarStore'),
  withState<IFullCalendarStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const scheduleService = inject(ScheduleService);
    const alertService = inject(AlertService);
    const {
      filter: { date },
      professionalId,
    } = store;

    function getBarberAppointments(
      formattedDate: string
    ): Observable<Apollo.QueryResult<IBarberAppointmentsResponse>> {
      return scheduleService.getBarberAppointments(
        formattedDate,
        professionalId()
      );
    }

    function getBarberBlockers(
      formattedDate: string
    ): Observable<Apollo.QueryResult<IBarberBlockersResponse>> {
      return scheduleService.getBarberBlockers(formattedDate, professionalId());
    }

    function setProfessionalId(professionalId: string): void {
      updateStateLib(store, `[Set professionalId]`, {
        professionalId: professionalId,
      });
    }

    function _differenceById<T extends ICalendarEvents>(
      newArr: T[],
      oldArr: T[]
    ): T[] {
      const oldIds = new Set(oldArr.map((a) => a.id));
      return newArr.filter((a) => !oldIds.has(a.id));
    }

    function getBarberSchedule() {
      const formattedDate = dayjs(date()).format('YYYY-MM-DD');
      return forkJoin({
        appointments: getBarberAppointments(formattedDate),
        blockers: getBarberBlockers(formattedDate),
      }).pipe(
        tapResponse({
          next: ({ appointments, blockers }) => {
            const events = transformToCalendarEvents(appointments, blockers);
            updateStateLib(store, `[Set calendar events]`, {
              calendarEvents: events,
            });
          },
          error: console.error,
          finalize: () => {
            updateStateLib(store, `[Get Barber schedule Loaded]`, setLoaded());
          },
        })
      );
    }

    function transformToCalendarEvents(
      appointments: Apollo.QueryResult<IBarberAppointmentsResponse>,
      blockers: Apollo.QueryResult<IBarberBlockersResponse>
    ): ICalendarEvents[] {
      const appointmentList = appointments.data?.appointments.map(
        (appointment) => {
          const DAY_STRING = dayjs(appointment.date)
            .format()
            .replace(/T.*$/, '');
          return {
            id: appointment.documentId,
            editable: false,
            title: appointment.service.name,
            ...(appointment.appointmentStatus === 'canceled' && {
              className: 'canceled',
            }),
            start: DAY_STRING + 'T' + appointment.startTime,
            end: DAY_STRING + 'T' + appointment.endTime,
            appointment: appointment,
          };
        }
      );

      const blockerList = blockers.data?.scheduleBlockers.map((blocker) => {
        const DAY_STRING = dayjs(date()).format().replace(/T.*$/, '');
        return {
          id: blocker.documentId,
          editable: false,
          title: 'Bloqueio de agenda',
          start: DAY_STRING + 'T' + blocker.startTime,
          end: DAY_STRING + 'T' + blocker.endTime,
          className: 'block-event',
          blocker: blocker,
        };
      });
      return [...(blockerList || []), ...(appointmentList || [])];
    }

    const getScheduleOnDateChange = rxMethod<{
      date: string;
      _professionalId: string;
    }>(
      pipe(
        tap(({ date, _professionalId }) => {
          updateStateLib(
            store,
            `[Get Barber schedule List Loading]`,
            setLoading()
          );
          if (!professionalId()) {
            setProfessionalId(_professionalId);
          }

          updateStateLib(store, `[Set date filter]`, {
            filter: {
              date: new Date(date),
            },
          });
        }),
        debounceTime(300),
        switchMap(() => getBarberSchedule())
      )
    );

    const schedulePolling = rxMethod<void>(
      pipe(
        tap(() => {
          updateStateLib(
            store,
            `[Get Barber schedule List Loading]`,
            setLoading()
          );
        }),
        debounceTime(300),
        switchMap(() => {
          const formattedDate = dayjs(date()).format('YYYY-MM-DD');
          return forkJoin({
            appointments: getBarberAppointments(formattedDate),
            blockers: getBarberBlockers(formattedDate),
          }).pipe(
            tapResponse({
              next: ({ appointments, blockers }) => {
                const oldEvents = store.calendarEvents();
                const newEvents = transformToCalendarEvents(
                  appointments,
                  blockers
                );

                const addedEvents = _differenceById(newEvents, oldEvents);

                const canceledEvents = newEvents.filter((newEvent) => {
                  const matchingOldEvent = oldEvents.find(
                    (oldEvent) => oldEvent.id === newEvent.id
                  );
                  return (
                    matchingOldEvent &&
                    matchingOldEvent.appointment?.appointmentStatus !==
                      newEvent.appointment?.appointmentStatus &&
                    newEvent.appointment?.appointmentStatus === 'canceled'
                  );
                });

                if (addedEvents.length) {
                  updateStateLib(store, `[Set New calendar events]`, {
                    calendarEvents: newEvents,
                  });

                  const audio = new Audio('assets/audios/new-appointment.wav');
                  audio.play();

                  addedEvents.map((event) => {
                    if (event?.appointment) {
                      alertService.showCustomAlert('shared.new-appointment', {
                        toastComponent: CustomToastComponentComponent,
                        closeButton: true,
                        positionClass: 'toast-bottom-right',
                        disableTimeOut: true,
                        payload: {
                          appointment: event.appointment,
                        },
                      });
                    }
                  });
                }

                if (canceledEvents.length) {
                  updateStateLib(store, `[Set new canceled calendar event]`, {
                    calendarEvents: newEvents,
                  });

                  const audio = new Audio(
                    'assets/audios/cancel-appointment.wav'
                  );
                  audio.play();

                  canceledEvents.map((event) => {
                    if (event?.appointment) {
                      alertService.showCustomAlert(
                        'shared.canceled-appointment',
                        {
                          toastComponent: CustomToastComponentComponent,
                          closeButton: true,
                          positionClass: 'toast-bottom-right',
                          disableTimeOut: true,
                          payload: {
                            appointment: event.appointment,
                          },
                        }
                      );
                    }
                  });
                }
              },
              error: console.error,
              finalize: () => {
                updateStateLib(
                  store,
                  `[Get Barber schedule Loaded]`,
                  setLoaded()
                );
              },
            })
          );
        })
      )
    );

    return {
      getBarberAppointments,
      getBarberBlockers,
      getBarberSchedule,
      getScheduleOnDateChange,
      setProfessionalId,
      schedulePolling,
    };
  })
);
