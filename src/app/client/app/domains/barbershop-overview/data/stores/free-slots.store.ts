import {
  signalStore,
  withComputed,
  withMethods,
  withState,
  withHooks,
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import {
  catchError,
  combineLatest,
  concatMap,
  debounceTime,
  finalize,
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
  IFreeSlot,
  UserStore,
  updateStateLib,
} from 'ba-ngrx-signal-based';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { IFreeSlotsStore } from '../types';
import { FreeSlotsService } from '../services';
import { toObservable } from '@angular/core/rxjs-interop';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
dayjs.extend(customParseFormat);

const initialState: IFreeSlotsStore = {
  freeSlotsList: [],
  professionalList: [],
  selectedSlot: {
    date: '',
    endTime: '',
    startTime: '',
  },
  barbershopId: '',
  serviceId: '',
  selectedBarberId: null,
  date: new Date(),
  nextAvailabilitySearch: false,
  weekSlotList: [],
};

export const FreeSlotsStore = signalStore(
  withDevtools('FreeSlots'),
  withState<IFreeSlotsStore>(initialState),
  withCallState({ collection: 'freeSlotList' }),
  withCallState({ collection: 'professional' }),
  withCallState({ collection: 'weekAvailability' }),
  withCallState({ collection: 'appointmentCreation' }),
  withComputed(
    ({
      freeSlotsList,
      weekAvailabilityLoaded,
      nextAvailabilitySearch,
      weekSlotList,
      freeSlotListLoaded,
    }) => {
      const isNextAvailabilityView = computed(() => {
        if (!weekAvailabilityLoaded()) {
          return false;
        }

        const hasNotWeekAvailability = weekSlotList().every(
          (day) => !day?.slots?.length
        );
        return hasNotWeekAvailability && !freeSlotsList().length;
      });

      const noSlotsWeekAvailability = computed(() => {
        if (!nextAvailabilitySearch()) {
          return false;
        }

        const hasNotWeekAvailability = weekSlotList().every(
          (day) => !day?.slots?.length
        );
        return hasNotWeekAvailability && !freeSlotsList().length;
      });

      const isFreeSlotContentReady = computed(() => {
        return freeSlotListLoaded() && weekAvailabilityLoaded();
      });

      return {
        isNextAvailabilityView,
        noSlotsWeekAvailability,
        isFreeSlotContentReady,
      };
    }
  ),
  withMethods((store) => {
    const { barbershopId, serviceId, weekSlotList, freeSlotsList } = store;
    const freeSlotsService = inject(FreeSlotsService);
    const router = inject(Router);
    const alertService = inject(AlertService);
    const userStore = inject(UserStore);

    const getProfessionalList = rxMethod<void>(
      concatMap(() => {
        updateStateLib(
          store,
          `[Get Professional List Loading]`,
          setLoading('professional')
        );
        return freeSlotsService
          .getBarbersFromBarbershopByServiceId(serviceId(), barbershopId())
          .pipe(
            tapResponse({
              next: (resp) => {
                updateStateLib(store, `[Set Professional List]`, {
                  professionalList: resp.data?.barbers,
                });
              },
              error: console.error,
              finalize: () => {
                updateStateLib(
                  store,
                  `[Get Professional List Loaded]`,
                  setLoaded('professional')
                );
              },
            })
          );
      })
    );

    const _weekAvailabilitySetup = rxMethod<{
      date: Date | null | undefined;
      selectedBarberId: string | null | undefined;
      barbershopId: string;
      serviceId: string;
      freeSlotListLoaded: boolean;
    }>(
      concatMap(
        ({
          barbershopId,
          date,
          selectedBarberId,
          serviceId,
          freeSlotListLoaded,
        }) => {
          updateStateLib(
            store,
            `[Get weekAvailability List Loading]`,
            setLoading('weekAvailability')
          );

          if (
            !barbershopId ||
            !date ||
            !selectedBarberId ||
            !serviceId ||
            !freeSlotListLoaded
          ) {
            return of([]);
          }

          const nextDayRequests = [];
          for (let index = 1; index <= 4; index++) {
            const currentDay = dayjs(date).add(index, 'days');
            nextDayRequests.push(
              freeSlotsService.getFreeSlots({
                barberId: selectedBarberId!,
                barbershopId: barbershopId,
                serviceId: serviceId,
                date: dayjs(currentDay).format('YYYY-MM-DD'),
              })
            );
          }
          return combineLatest(nextDayRequests).pipe(
            map((resp) => {
              const nextDays = resp.map((day, index) => ({
                total: day.data?.freeSlotsByProfessional?.length,
                date: dayjs(date)
                  .add(index + 1, 'days')
                  .format('YYYY-MM-DD'),
                slots: day.data?.freeSlotsByProfessional,
              }));
              nextDays.unshift({
                total: freeSlotsList().length,
                date: dayjs(date).format('YYYY-MM-DD'),
                slots: freeSlotsList(),
              });

              return nextDays;
            }),
            tap((resp) => {
              updateStateLib(store, 'set weekSlotList', {
                weekSlotList: resp as {
                  total: number;
                  date: string;
                  slots: IFreeSlot[];
                }[],
              });
            }),
            catchError((error) => {
              console.error('Error fetching next days slots:', error);
              return of([]);
            }),
            finalize(() =>
              updateStateLib(
                store,
                `[Get weekAvailability List Loading]`,
                setLoaded('weekAvailability')
              )
            )
          );
        }
      )
    );

    const createAppointment = rxMethod<MatDialogRef<unknown, unknown>>(
      concatMap((dialogRef) => {
        updateStateLib(
          store,
          `[Appointment Creation Loading]`,
          setLoading('appointmentCreation')
        );
        return freeSlotsService
          .bookAppointment({
            service: store.serviceId(),
            date: dayjs(store.selectedSlot.date()).format('YYYY-MM-DD'),
            client: userStore.documentId(),
            barber: store.selectedBarberId() as string,
            barbershop: store.barbershopId(),
            startTime: dayjs(store.selectedSlot.startTime(), 'HH:mm').format(
              'HH:mm:ss'
            ),
            endTime: dayjs(store.selectedSlot.endTime(), 'HH:mm').format(
              'HH:mm:ss'
            ),
          })
          .pipe(
            tapResponse({
              next: (resp) => {
                if (!resp.error) {
                  alertService.showSuccess('shared.success-booking-msg');
                  router.navigate(['appointments']);
                  dialogRef.close();
                }
              },
              error: console.error,
              finalize: () => {
                updateStateLib(
                  store,
                  `[Appointment Creation Loaded]`,
                  setLoaded('appointmentCreation')
                );
              },
            })
          );
      })
    );

    const getFreeSlots = rxMethod<
      Partial<{
        barberId: string;
        date: Date;
        nextAvailability: boolean;
      }>
    >(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Get Free slots Loading]`,
            setLoading('freeSlotList')
          )
        ),
        debounceTime(300),
        switchMap((freeSlotForm) => {
          setSelectedBarberId(freeSlotForm.barberId);
          setDate(freeSlotForm.date);
          if (freeSlotForm.barberId && freeSlotForm.date) {
            return freeSlotsService
              .getFreeSlots({
                barberId: freeSlotForm.barberId,
                barbershopId: barbershopId(),
                serviceId: serviceId(),
                date: dayjs(freeSlotForm.date).format('YYYY-MM-DD'),
                nextAvailability: freeSlotForm.nextAvailability,
              })
              .pipe(
                tapResponse({
                  next: (resp) => {
                    clearSelectedSlot();
                    updateStateLib(store, '[Set Free slots]', {
                      freeSlotsList: resp.data?.freeSlotsByProfessional || [],
                      nextAvailabilitySearch: freeSlotForm.nextAvailability,
                    });
                    if (
                      resp.data?.freeSlotsByProfessional.length &&
                      freeSlotForm.nextAvailability
                    ) {
                      const [firsSlot] = resp.data.freeSlotsByProfessional;
                      updateStateLib(store, '[Set date based on slots]', {
                        ...(firsSlot?.date && {
                          date: new Date(firsSlot?.date),
                        }),
                      });
                    }
                  },
                  error: console.error,
                  finalize: () => {
                    updateStateLib(
                      store,
                      `[Get Free slots Loaded]`,
                      setLoaded('freeSlotList')
                    );
                  },
                })
              );
          } else {
            updateStateLib(store, `[Set Free slots]`, {
              freeSlotsList: [],
            });
            updateStateLib(
              store,
              `[Get Free slots Loaded]`,
              setLoaded('freeSlotList')
            );
            return of([]);
          }
        })
      )
    );

    function getSlotsBasedOnNextDay(date: string): void {
      const selectedNextDay = weekSlotList().find(
        (value) => value.date === date
      );

      if (selectedNextDay) {
        clearSelectedSlot();
        updateStateLib(store, '[Set freeSlotsList based on next day]', {
          freeSlotsList: selectedNextDay?.slots,
        });
      }
    }

    function setServiceId(serviceId: string): void {
      updateStateLib(store, '[Set ServiceID]', {
        serviceId: serviceId,
      });
    }

    function setBarbershopId(barbershopId: string): void {
      updateStateLib(store, '[Set BarbershopId]', {
        barbershopId: barbershopId,
      });
    }

    function clearFreeSlotList(): void {
      updateStateLib(store, '[Empty slots]', {
        freeSlotsList: [],
      });
    }

    function setSeletedSlot(selectedSlot: IFreeSlot): void {
      updateStateLib(store, '[Set selected slot]', {
        selectedSlot: selectedSlot,
      });
    }

    function setSelectedBarberId(barberId: string | null | undefined): void {
      updateStateLib(store, '[Set selected barber]', {
        selectedBarberId: barberId,
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

    return {
      setDate,
      setSelectedBarberId,
      setSeletedSlot,
      clearFreeSlotList,
      setBarbershopId,
      setServiceId,
      getSlotsBasedOnNextDay,
      getFreeSlots,
      createAppointment,
      getProfessionalList,
      _weekAvailabilitySetup,
    };
  }),
  withHooks({
    onInit({
      _weekAvailabilitySetup,
      barbershopId,
      serviceId,
      date,
      selectedBarberId,
      freeSlotListLoaded,
    }) {
      const barbershopId$ = toObservable(barbershopId);
      const serviceId$ = toObservable(serviceId);
      const date$ = toObservable(date);
      const selectedBarberId$ = toObservable(selectedBarberId);
      const freeSlotListLoaded$ = toObservable(freeSlotListLoaded);

      _weekAvailabilitySetup(
        combineLatest({
          barbershopId: barbershopId$,
          serviceId: serviceId$,
          date: date$,
          selectedBarberId: selectedBarberId$,
          freeSlotListLoaded: freeSlotListLoaded$,
        })
      );
    },
  })
);
