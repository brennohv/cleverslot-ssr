import { signalStore, withMethods, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { concatMap, map, of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  AlertService,
  StrapiApiReferenceEnum,
  UserStore,
  updateStateLib,
} from 'ba-ngrx-signal-based';
import {
  IBarberConfigStore,
  IBarberUploadRx,
  IEditProfessionalView,
  IServiceId,
} from '@barber/barber-config/data/types';
import { BarberConfigService } from '@barber/barber-config/data/services';
import { MatDialogRef } from '@angular/material/dialog';

const initialState: IBarberConfigStore = {
  barber: {
    documentId: '',
    firstName: '',
    lastName: '',
    photoUrl: null,
    photoId: null,
    services: [],
  },
};

export const BarberConfigStore = signalStore(
  withDevtools('BarberConfigStore'),
  withState<IBarberConfigStore>(initialState),
  withCallState(),
  withCallState({ collection: 'uploadFile' }),
  withMethods((store) => {
    const barberConfigService = inject(BarberConfigService);
    const userStore = inject(UserStore);
    const alertService = inject(AlertService);
    return {
      updateServiceList: (services: IServiceId[]) => {
        updateStateLib(
          store,
          `[Set Barber Services from BarberConfigServicesStore]`,
          {
            barber: {
              ...store.barber(),
              services: services,
            },
          },
        );
      },
      getBarberProfile: rxMethod<void>(
        concatMap(() => {
          updateStateLib(store, `[Get Barber profile Loading]`, setLoading());
          return barberConfigService
            .getBarberProfile(userStore.barber().documentId)
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (!resp?.error && resp.data) {
                    updateStateLib(store, `[Set Barber profile]`, {
                      barber: {
                        ...resp?.data?.barber,
                        photoUrl: userStore.photoUrl(),
                        photoId: userStore.photoId(),
                      },
                    });
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barber profile Loaded]`,
                    setLoaded(),
                  );
                },
              }),
            );
        }),
      ),
      uploadProfessionalImage: rxMethod<IBarberUploadRx>(
        pipe(
          tap(() =>
            updateStateLib(
              store,
              `[Upload Barber profile photo Loading]`,
              setLoading('uploadFile'),
            ),
          ),
          switchMap(({ file, matDialogRef, photoId }) => {
            if (photoId) {
              return barberConfigService
                .deleteBarberPhoto(photoId)
                .pipe(map(() => ({ file, matDialogRef })));
            }

            return of({ file: file, matDialogRef });
          }),
          switchMap(({ file, matDialogRef }) => {
            return barberConfigService
              .uploadBarberPhoto({
                file: file,
                ref: StrapiApiReferenceEnum.USER,
                field: 'photo',
                refId: userStore.id(),
              })
              .pipe(
                tapResponse({
                  next: (resp) => {
                    if (resp?.length) {
                      const [barberImg] = resp;
                      updateStateLib(store, `[Set Barber profile photo]`, {
                        barber: {
                          ...store.barber(),
                          photoUrl: barberImg.url,
                          photoId: barberImg.id,
                        },
                      });
                      alertService.showSuccess(
                        'mfBarber.barber-config.upload-image-modal.success-msg',
                      );
                      userStore.updateUserPhotoByBarberConfig(
                        barberImg.url!,
                        barberImg.id,
                      );
                    } else {
                      alertService.showError('shared.general-error');
                    }
                  },
                  error: console.error,
                  finalize: () => {
                    updateStateLib(
                      store,
                      `[Upload Barber profile photo Loaded]`,
                      setLoaded('uploadFile'),
                    );
                    matDialogRef.close();
                  },
                }),
              );
          }),
        ),
      ),
      editProfessionalName: rxMethod<{
        view: IEditProfessionalView;
        formValue: string;
        matDialogRef: MatDialogRef<unknown>;
      }>(
        concatMap(({ formValue, view, matDialogRef }) => {
          updateStateLib(store, `[Edit Barber name]`, setLoading());
          return barberConfigService
            .updateBarberName({
              barberId: store.barber().documentId,
              data: {
                ...(view === IEditProfessionalView.FIRST_NAME && {
                  firstName: formValue,
                }),
                ...(view === IEditProfessionalView.LAST_NAME && {
                  lastName: formValue,
                }),
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (!resp?.error && resp.data) {
                    updateStateLib(store, `[Set Barber name]`, {
                      barber: {
                        ...store.barber(),
                        firstName: resp.data.updateBarber.firstName,
                        lastName: resp.data.updateBarber.lastName,
                      },
                    });
                    alertService.showSuccess('shared.general-success-update');
                  } else {
                    alertService.showError('shared.general-error');
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Edit Barber name Loaded]`,
                    setLoaded(),
                  );
                  matDialogRef.close();
                },
              }),
            );
        }),
      ),
    };
  }),
);
