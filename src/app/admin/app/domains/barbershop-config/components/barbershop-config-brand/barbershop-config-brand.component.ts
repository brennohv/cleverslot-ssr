import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  BarbershopConfigCardComponent,
  BarbershopConfigHeaderComponent,
  ConfirmDeleteModalComponent,
  EditBarbershopNameModalComponent,
  UploadBarbershopImageModalComponent,
} from '@admin/barbershop-config/components';
import { BarbershopConfigBrandStore } from '@admin/barbershop-config/data/stores';
import { IConfirmDeleteModalData } from '@admin/barbershop-config/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { GetImgUrlPipe } from 'ba-ngrx-signal-based';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { first } from 'rxjs';

@Component({
  selector: 'app-barbershop-config-brand',
  standalone: true,
  imports: [
    BarbershopConfigHeaderComponent,
    BarbershopConfigCardComponent,
    TranslocoPipe,
    TranslocoDirective,
    GetImgUrlPipe,
    MatIcon,
    MatButtonModule,
    NgxSkeletonLoaderModule,
  ],
  providers: [BarbershopConfigBrandStore],
  templateUrl: './barbershop-config-brand.component.html',
  styleUrl: './barbershop-config-brand.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigBrandComponent {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.config-brand.';
  #barbershopConfigBrandStore = inject(BarbershopConfigBrandStore);
  #injector = inject(Injector);
  #dialog = inject(MatDialog);
  barbershopName = this.#barbershopConfigBrandStore.name;
  barbershopLogo = this.#barbershopConfigBrandStore.logo;
  barbershopImages = this.#barbershopConfigBrandStore.images;
  estabilishmentUrl = this.#barbershopConfigBrandStore.estabilishmentUrl;
  isLoaded = this.#barbershopConfigBrandStore.loaded;
  canAddMoreImages = computed(() => this.barbershopImages().length < 5);
  readonly shouldShowSuccessMessageX = signal<boolean>(false);

  openUploadLogoModal(): void {
    this.#dialog.open<UploadBarbershopImageModalComponent>(
      UploadBarbershopImageModalComponent,
      {
        data: {
          title: 'Logo edit',
          context: 'logo',
        },
        injector: this.#injector,
        panelClass: ['s-large-dialog'],
      }
    );
  }

  openUploadImageModal(): void {
    this.#dialog.open<UploadBarbershopImageModalComponent>(
      UploadBarbershopImageModalComponent,
      {
        data: {
          title: 'Add a image',
          context: 'image',
        },
        injector: this.#injector,
        panelClass: ['s-large-dialog'],
      }
    );
  }

  openEditBarbershopName(): void {
    this.#dialog.open<EditBarbershopNameModalComponent>(
      EditBarbershopNameModalComponent,
      {
        injector: this.#injector,
        panelClass: ['s-large-dialog'],
      }
    );
  }

  deleteImage(imageId: string): void {
    const dialogRef = this.#dialog.open<
      ConfirmDeleteModalComponent,
      IConfirmDeleteModalData,
      string | null
    >(ConfirmDeleteModalComponent, {
      panelClass: ['s-large-dialog'],
      data: {
        title: this.I18N_PREFFIX + 'confirm-delete-title',
        description: this.I18N_PREFFIX + 'confirm-delete-description',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((resp) => {
        if (resp === 'Yes') {
          this.#barbershopConfigBrandStore.deleteImage(imageId);
        }
      });
  }

  async clipBoardSetup(): Promise<void> {
    const messageDurationTotal = 3000;

    try {
      await navigator.clipboard.writeText(this.estabilishmentUrl());
      this.shouldShowSuccessMessageX.set(true);

      setTimeout(() => {
        this.shouldShowSuccessMessageX.set(false);
      }, messageDurationTotal);
    } catch (error) {
      console.error('It was not possible to copy the URL');
    }
  }
}
