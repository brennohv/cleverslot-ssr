import { signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import {
  debounceTime,
  distinctUntilChanged,
  of,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { UserStore, updateStateLib } from 'ba-ngrx-signal-based';

import { BarberComissionsService } from '@barber/barber-comissions/data/services';
import { IBarberComissionsStore } from '@barber/barber-comissions/data/types';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const initialState: IBarberComissionsStore = {
  services: [],
  salary: 0,
  recurrency: '',
};

export const BarberComissionsStore = signalStore(
  withDevtools('barberComissions'),
  withState<IBarberComissionsStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const userStore = inject(UserStore);
    const barberComissionsService = inject(BarberComissionsService);

    const getBarberComissions = rxMethod<
      Partial<{
        startDate: Date;
        endDate: Date | undefined;
      }>
    >(
      pipe(
        tap(() =>
          updateStateLib(store, `[Get comissions loading]`, setLoading()),
        ),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((form) => {
          if (
            !!form.startDate &&
            dayjs(form.startDate).isValid() &&
            !!form.endDate &&
            dayjs(form.endDate).isValid()
          ) {
            return barberComissionsService
              .getBarberComissions({
                barberId: userStore.barber().documentId,
                barbershopId: userStore.barber().barbershopDocId,
                dateStart: dayjs(form.startDate).format('YYYY-MM-DD'),
                dateEnd: dayjs(form.endDate).format('YYYY-MM-DD'),
              })

              .pipe(
                tapResponse({
                  next: (resp) => {
                    updateStateLib(store, `[Set comissions]`, {
                      services: resp?.data?.comissionsByProfessional.services,
                      salary: resp?.data?.comissionsByProfessional.salary,
                      recurrency:
                        resp?.data?.comissionsByProfessional.services?.[0]
                          ?.recurrency,
                    });
                  },
                  error: console.error,
                  finalize: () => {
                    updateStateLib(
                      store,
                      `[Get comissions loaded]`,
                      setLoaded(),
                    );
                  },
                }),
              );
          } else {
            updateStateLib(store, `[Set empty comissions List]`, {
              services: [],
              salary: 0,
            });
            updateStateLib(store, `[Get comissions loaded]`, setLoaded());
            return of([]);
          }
        }),
      ),
    );

    return {
      getBarberComissions,
    };
  }),
);
