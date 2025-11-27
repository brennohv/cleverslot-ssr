import { signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { concatMap } from 'rxjs';
import { ScheduleService } from '@admin/barbershop-schedule/data/services';
import { IBarbershopScheduleStore } from '@admin/barbershop-schedule/data/types';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { UserStore, updateStateLib } from 'ba-ngrx-signal-based';

const initialState: IBarbershopScheduleStore = {
  professionalList: [],
  businessHours: [],
};

export const BarbershopScheduleStore = signalStore(
  withDevtools('BarbershopSchedule'),
  withState<IBarbershopScheduleStore>(initialState),
  withCallState(),
  withCallState({ collection: 'professional' }),
  withMethods((store) => {
    const scheduleService = inject(ScheduleService);
    const userStore = inject(UserStore);

    const getProfessionalList = rxMethod<void>(
      concatMap(() => {
        updateStateLib(
          store,
          `[Get Professional List Loading]`,
          setLoading('professional')
        );
        return scheduleService
          .getAllProfessionals(userStore.admin().barbershopDocId)
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

    const getBarbershopBusinessHour = rxMethod<void>(
      concatMap(() => {
        return scheduleService
          .getBusinessHour(userStore.admin().barbershopSlug)
          .pipe(
            tapResponse({
              next: (resp) => {
                updateStateLib(store, `[Set Barber business hour]`, {
                  businessHours: resp.data,
                });
              },
              error: console.error,
              finalize: () => {
                updateStateLib(
                  store,
                  `[Get Barber business hour Loaded]`,
                  setLoaded()
                );
              },
            })
          );
      })
    );

    return {
      getProfessionalList,
      getBarbershopBusinessHour,
    };
  })
);
