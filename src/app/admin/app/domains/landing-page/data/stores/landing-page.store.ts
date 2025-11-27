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
  filter,
  finalize,
  from,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  UserStore,
  updateStateLib,
  InputPhone,
  AuthStore,
} from 'ba-ngrx-signal-based';
import { LandingPageServiceService } from '@admin/landing-page/data/services';

export interface ILandingPageStore {
  form: ILandingPageForm;
  hasCreatedBarbershop: boolean;
}

export interface ILandingPageForm {
  username: string | undefined;
  email: string | undefined;
  estabilishmentName: string | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;
  telephone: InputPhone | null | undefined;
}

const initialState: ILandingPageStore = {
  form: {
    username: '',
    email: '',
    estabilishmentName: '',
    password: '',
    confirmPassword: '',
    telephone: null,
  },
  hasCreatedBarbershop: false,
};

export const LandingPageStore = signalStore(
  withDevtools('LandingPageStore'),
  withState<ILandingPageStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const { form } = store;
    const landingPageServiceService = inject(LandingPageServiceService);
    const userStore = inject(UserStore);
    const authStore = inject(AuthStore);

    function registerAndCreateEstabilishment() {
      updateStateLib(store, `[Add new barber loading]`, setLoading());
      return from(
        authStore.register(
          {
            email: form.email()!,
            password: form.password()!,
            telephone: form.telephone()!,
            username: form.username()!,
          },
          'LandingPageComponent',
          false
        )
      ).pipe(
        filter((resp) => resp),
        switchMap(() => {
          return landingPageServiceService
            .createBarbershop(form().estabilishmentName!)
            .pipe(
              tap((resp) => {
                if (!resp.error && resp.data) {
                  updateStateLib(store, '[hasCreatedBarbershop as true]', {
                    hasCreatedBarbershop: true,
                  });
                  userStore.updateUserAdmin(
                    {
                      barbershopDocId: resp.data?.createBarbershop.documentId,
                      barbershopSlug: resp.data?.createBarbershop.slug,
                      documentId:
                        resp.data?.createBarbershop.admins[0].documentId,
                    },
                    'landingPageCompoentn'
                  );
                }
              })
            );
        }),
        tap(() =>
          updateStateLib(store, `[Add new barber loading]`, setLoaded())
        ),
        finalize(() =>
          updateStateLib(store, `[Add new barber loading]`, setLoaded())
        )
      );
    }

    const setFormRx = rxMethod<Partial<ILandingPageForm>>(
      pipe(
        debounceTime(300),
        tap((value) => {
          updateStateLib(store, 'Update form', {
            form: {
              ...form(),
              ...value,
            },
          });
        })
      )
    );

    return {
      registerAndCreateEstabilishment,
      setFormRx,
    };
  })
);
