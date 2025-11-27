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

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import { BarbershopConfigComissionsService } from '../services';
import { IBarbershopComissionsStore } from '../types';

const initialState: IBarbershopComissionsStore = {
  services: [],
  salary: 0,
  recurrency: '',
  professionalList: [],
};

export const BarbershopComissionsStore = signalStore(
  withDevtools('BarbershopComissionsStore'),
  withState<IBarbershopComissionsStore>(initialState),
  withCallState(),
  withCallState({ collection: 'professionals' }),
  withMethods((store) => {
    const userStore = inject(UserStore);
    const barbershopConfigComissionsService = inject(
      BarbershopConfigComissionsService
    );

    const getProfessionalList = rxMethod<void>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Get Professional List Loading]`,
            setLoading('professionals')
          )
        ),
        debounceTime(300),
        switchMap(() => {
          return barbershopConfigComissionsService
            .getBarberList(userStore.admin().barbershopDocId)
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (!resp.data) return;
                  updateStateLib(store, `[Set Professional List]`, {
                    professionalList: resp.data.barbers,
                  });
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Professional List Loaded]`,
                    setLoaded('professionals')
                  );
                },
              })
            );
        })
      )
    );

    const getBarberComissions = rxMethod<
      Partial<{
        startDate: Date;
        endDate: Date | undefined;
        barberId?: string;
      }>
    >(
      pipe(
        tap(() =>
          updateStateLib(store, `[Get comissions loading]`, setLoading())
        ),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(({ startDate, endDate, barberId }) => {
          if (
            !!startDate &&
            dayjs(startDate).isValid() &&
            !!endDate &&
            dayjs(endDate).isValid() &&
            !!barberId
          ) {
            return barbershopConfigComissionsService
              .getBarberComissions({
                barberId: barberId,
                barbershopId: userStore.admin().barbershopDocId,
                dateStart: dayjs(startDate).format('YYYY-MM-DD'),
                dateEnd: dayjs(endDate).format('YYYY-MM-DD'),
              })

              .pipe(
                tapResponse({
                  next: (resp) => {
                    if (!resp.data) return;
                    updateStateLib(store, `[Set comissions]`, {
                      services: resp.data.comissionsByProfessional.services,
                      salary: resp.data.comissionsByProfessional.salary,
                      recurrency:
                        resp.data.comissionsByProfessional.services?.[0]
                          ?.recurrency,
                    });
                  },
                  error: console.error,
                  finalize: () => {
                    updateStateLib(
                      store,
                      `[Get comissions loaded]`,
                      setLoaded()
                    );
                  },
                })
              );
          } else {
            updateStateLib(store, `[Set empty comissions List]`, {
              services: [],
              salary: 0,
            });
            updateStateLib(store, `[Get comissions loaded]`, setLoaded());
            return of([]);
          }
        })
      )
    );

    return {
      getBarberComissions,
      getProfessionalList,
    };
  })
);
