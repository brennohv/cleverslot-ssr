import { signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import { inject, PLATFORM_ID } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { debounceTime, map, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { AlertService, UserStore, updateStateLib } from 'ba-ngrx-signal-based';
import { BarbershopConfigBusinessHoursService } from '../services';
import {
  IBarbershopBusinessHoursStore,
  IBusinessHourDTO,
  IBusinessHourStore,
  onChangeBusinessHourParams,
} from '../types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { isPlatformBrowser } from '@angular/common';
dayjs.extend(customParseFormat);

const dayOrder = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const initialState: IBarbershopBusinessHoursStore = {
  businessHours: [],
};

export const BarbershopConfigBusinessHoursStore = signalStore(
  withDevtools('BarbershopConfigBusinessHoursStore'),
  withState<IBarbershopBusinessHoursStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const barbershopConfigBusinessHoursService = inject(
      BarbershopConfigBusinessHoursService
    );
    const userStore = inject(UserStore);
    const alertService = inject(AlertService);

    const { businessHours } = store;

    function addActiveBasedOnPeriods(
      businessHours: IBusinessHourDTO[]
    ): IBusinessHourStore[] {
      return [
        ...businessHours.map((dayObj) => {
          return {
            ...dayObj,
            active: !!dayObj.firstPeriodStart && !!dayObj.firstPeriodEnd,
            secondPeriodActive:
              !!dayObj.secondPeriodStart && !!dayObj.secondPeriodEnd,
          };
        }),
      ];
    }

    function insertEmptyDays(businessHour: IBusinessHourStore[]) {
      dayOrder.map((day) => {
        if (!businessHour.some((dayObj) => dayObj.day === day)) {
          businessHour.push({
            day,
            firstPeriodStart: '',
            firstPeriodEnd: '',
            secondPeriodEnd: '',
            secondPeriodStart: '',
            active: false,
            secondPeriodActive: false,
          });
        }
      });
    }

    function sortBusinnesHours(
      businessHours: IBusinessHourStore[]
    ): IBusinessHourStore[] {
      return [...businessHours].sort(
        (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
      );
    }

    function toggleActiveBusinessHour(businessHour: IBusinessHourStore): void {
      const newList = businessHours().map((dayObj) => {
        if (dayObj.day === businessHour.day) {
          return {
            ...dayObj,
            active: !businessHour.active,
          };
        }
        return dayObj;
      });

      updateStateLib(store, `[Toggle Barbershop Business Hours]`, {
        businessHours: sortBusinnesHours(newList),
      });
    }

    function toggleSecondPeriodActiveBusinessHour(
      businessHour: IBusinessHourStore
    ): void {
      const newList = businessHours().map((dayObj) => {
        if (dayObj.day === businessHour.day) {
          return {
            ...dayObj,
            secondPeriodActive: !businessHour.secondPeriodActive,
          };
        }
        return dayObj;
      });

      updateStateLib(store, `[Toggle Barbershop Business Hours]`, {
        businessHours: sortBusinnesHours(newList),
      });
    }

    function formatTime(time: string, format: string = 'HH:mm:ss'): string {
      return dayjs(time, 'HH:mm').format(format);
    }

    const businessHourChange = rxMethod<onChangeBusinessHourParams>(
      pipe(
        debounceTime(300),
        tap((params) => {
          const newList = businessHours().map((dayObj) => {
            if (dayObj.day === params.day) {
              return {
                ...dayObj,
                [params.entry]: params.value,
              };
            }
            return dayObj;
          });

          updateStateLib(store, `[Change Barbershop Business Hours]`, {
            businessHours: sortBusinnesHours(newList),
          });
        })
      )
    );

    const getBarbershopBusinnessHours = rxMethod<void>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Get Barbershop Business Hours Loading]`,
            setLoading()
          )
        ),
        debounceTime(300),
        switchMap(() => {
          return barbershopConfigBusinessHoursService
            .getBarbershopBusinessHours(userStore.admin().barbershopDocId)
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (!resp.data) return;
                  if (resp.data.barbershop) {
                    const businessHours: IBusinessHourStore[] =
                      addActiveBasedOnPeriods(
                        resp.data.barbershop.establishment
                      );

                    insertEmptyDays(businessHours);

                    updateStateLib(store, `[Set Barbershop Business Hours]`, {
                      businessHours: sortBusinnesHours(businessHours),
                    });
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop Business Hours Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    const updateBarbershopBusinnessHours = rxMethod<void>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Update Barbershop Business Hours Loading]`,
            setLoading()
          )
        ),
        debounceTime(300),
        map(() => {
          const removeEmptyDays = businessHours().filter(
            (dayObj) =>
              !!dayObj.active &&
              !!dayObj.firstPeriodStart &&
              dayObj.firstPeriodEnd
          );
          const businessHourDto = removeEmptyDays.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            ({ active, ...rest }): IBusinessHourDTO => {
              return {
                day: rest.day,
                firstPeriodStart: formatTime(rest.firstPeriodStart),
                firstPeriodEnd: formatTime(rest.firstPeriodEnd),
                ...(!!rest.secondPeriodStart && {
                  secondPeriodStart: formatTime(rest.secondPeriodStart),
                }),
                ...(!!rest.secondPeriodEnd && {
                  secondPeriodEnd: formatTime(rest.secondPeriodEnd),
                }),
              } as IBusinessHourDTO;
            }
          );

          return businessHourDto;
        }),
        switchMap((businessHourDto) => {
          return barbershopConfigBusinessHoursService
            .updateBusinessHours({
              documentId: userStore.admin().barbershopDocId,
              data: { establishment: businessHourDto },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp.data?.updateBarbershop) {
                    const businessHours: IBusinessHourStore[] =
                      addActiveBasedOnPeriods(
                        resp.data.updateBarbershop.establishment
                      );

                    insertEmptyDays(businessHours);

                    updateStateLib(
                      store,
                      `[Set Updated Barbershop Business Hours]`,
                      {
                        businessHours: sortBusinnesHours(businessHours),
                      }
                    );

                    alertService.showSuccess('shared.general-success-update');
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Update Barbershop Business Hours Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );

    return {
      getBarbershopBusinnessHours,
      toggleActiveBusinessHour,
      toggleSecondPeriodActiveBusinessHour,
      businessHourChange,
      updateBarbershopBusinnessHours,
    };
  }),
  withHooks({
    onInit(store) {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        store.getBarbershopBusinnessHours();
      }
    },
  })
);
