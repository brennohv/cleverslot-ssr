import {
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed, inject, PLATFORM_ID } from '@angular/core';
import {
  withDevtools,
  withCallState,
  setLoading,
  setLoaded,
} from '@angular-architects/ngrx-toolkit';
import { debounceTime, exhaustMap, map, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  AlertService,
  IUserUploadRx,
  UploadFileService,
  UserStore,
  updateStateLib,
} from 'ba-ngrx-signal-based';
import { BarbershopConfigBrandService } from '../services';
import { IBarbershopBrandStore } from '../types';
import { MatDialogRef } from '@angular/material/dialog';
import { isPlatformBrowser } from '@angular/common';

const initialState: IBarbershopBrandStore = {
  images: [],
  logo: null,
  name: '',
  slug: '',
};

export const BarbershopConfigBrandStore = signalStore(
  withDevtools('BarbershopConfigBrandStore'),
  withState<IBarbershopBrandStore>(initialState),
  withCallState(),
  withMethods((store) => {
    const barbershopConfigBrandService = inject(BarbershopConfigBrandService);
    const userStore = inject(UserStore);
    const alertService = inject(AlertService);
    const uploadFileService = inject(UploadFileService);

    const getBarbershopBrand = rxMethod<void>(
      pipe(
        tap(() =>
          updateStateLib(store, `[Get Barbershop Brand Loading]`, setLoading())
        ),
        debounceTime(300),
        switchMap(() => {
          return barbershopConfigBrandService
            .getBarbershopBrand(userStore.admin().barbershopDocId)
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (!resp.data) return;
                  updateStateLib(store, `[Set Barbershop Brand]`, {
                    ...resp.data.barbershop,
                  });
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Get Barbershop Brand Loaded]`,
                    setLoaded()
                  );
                },
              })
            );
        })
      )
    );
    const uploadNewBarbershopLogo = rxMethod<IUserUploadRx>(
      exhaustMap(({ file, matDialogRef }) => {
        updateStateLib(store, `[Update barbershop logo loading]`, setLoading());
        return uploadFileService.uploadFile({ file }).pipe(
          map((resp) => ({ fileResp: resp, matDialogRef })),
          switchMap(({ fileResp, matDialogRef }) => {
            const [barbershopLogo] = fileResp;
            return barbershopConfigBrandService
              .updateBarbershopBrand({
                documentId: userStore.admin().barbershopDocId,
                data: {
                  logo: barbershopLogo.id,
                },
              })
              .pipe(
                tapResponse({
                  next: (resp) => {
                    if (resp?.data?.updateBarbershop) {
                      updateStateLib(store, `[Set barbershop logo]`, {
                        logo: resp?.data?.updateBarbershop.logo,
                      });
                      alertService.showSuccess('shared.general-success-update');
                    }
                  },
                  error: console.error,
                  finalize: () => {
                    updateStateLib(
                      store,
                      `[Update barbershop logo Loaded]`,
                      setLoaded()
                    );
                    matDialogRef.close();
                  },
                })
              );
          })
        );
      })
    );

    const editBarbershopName = rxMethod<{
      name: string;
      matDialogRef: MatDialogRef<unknown>;
    }>(
      pipe(
        tap(() =>
          updateStateLib(
            store,
            `[Update barbershop name loading]`,
            setLoading()
          )
        ),
        debounceTime(300),
        switchMap(({ matDialogRef, name }) => {
          return barbershopConfigBrandService
            .updateBarbershopBrand({
              documentId: userStore.admin().barbershopDocId,
              data: {
                name: name,
              },
            })
            .pipe(
              tapResponse({
                next: (resp) => {
                  if (resp?.data?.updateBarbershop) {
                    updateStateLib(store, `[Set barbershop name]`, {
                      name: resp?.data?.updateBarbershop.name,
                    });
                    alertService.showSuccess('shared.general-success-update');
                  }
                },
                error: console.error,
                finalize: () => {
                  updateStateLib(
                    store,
                    `[Update barbershop name Loaded]`,
                    setLoaded()
                  );
                  matDialogRef.close();
                },
              })
            );
        })
      )
    );
    const uploadNewBarbershopImage = rxMethod<IUserUploadRx>(
      exhaustMap(({ file, matDialogRef }) => {
        updateStateLib(store, `[Add barbershop image loading]`, setLoading());
        return uploadFileService.uploadFile({ file }).pipe(
          map((resp) => ({ fileResp: resp, matDialogRef })),
          switchMap(({ fileResp, matDialogRef }) => {
            const [barbershopImage] = fileResp;
            const imageIdList = store.images().map(({ id }) => id);
            return barbershopConfigBrandService
              .updateBarbershopBrand({
                documentId: userStore.admin().barbershopDocId,
                data: {
                  images: [...imageIdList, barbershopImage.id],
                },
              })
              .pipe(
                tapResponse({
                  next: (resp) => {
                    if (resp?.data?.updateBarbershop) {
                      updateStateLib(store, `[Set barbershop image]`, {
                        images: resp?.data?.updateBarbershop.images,
                      });
                      alertService.showSuccess('shared.general-success-update');
                    }
                  },
                  error: console.error,
                  finalize: () => {
                    updateStateLib(
                      store,
                      `[Add barbershop image Loaded]`,
                      setLoaded()
                    );
                    matDialogRef.close();
                  },
                })
              );
          })
        );
      })
    );
    const deleteImage = rxMethod<string>(
      exhaustMap((imageId) => {
        updateStateLib(store, `[Delete barbershop image]`, setLoading());
        return uploadFileService.deleteFile(imageId).pipe(
          tapResponse({
            next: (fileResp) => {
              if (fileResp) {
                const newIamgeList = store.images().filter((img) => {
                  return img.id != fileResp.id;
                });
                updateStateLib(store, `[Set new service list]`, {
                  images: newIamgeList,
                });
                alertService.showSuccess('shared.general-success-delete');
              }
            },
            error: console.error,
            finalize: () => {
              updateStateLib(store, `[Delete service Loaded]`, setLoaded());
            },
          })
        );
      })
    );

    return {
      getBarbershopBrand,
      uploadNewBarbershopLogo,
      uploadNewBarbershopImage,
      editBarbershopName,
      deleteImage,
    };
  }),
  withComputed(({ slug }) => ({
    estabilishmentUrl: computed(() => `https://cleverslot.pt/${slug()}`),
  })),
  withHooks({
    onInit(store) {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        store.getBarbershopBrand();
      }
    },
  })
);
