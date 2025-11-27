import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import {
  FileUploadInputComponent,
  GetImgUrlPipe,
  ModalBodyComponent,
  FileInputValidators,
  SpinnerComponent,
} from 'ba-ngrx-signal-based';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { BarbershopConfigBrandStore } from '@admin/barbershop-config/data/stores';

export interface EditBarbershopData {
  context: 'logo' | 'image';
}

@Component({
  selector: 'app-edit-barbershop-logo-modal',
  standalone: true,
  imports: [
    ModalBodyComponent,
    FileUploadInputComponent,
    GetImgUrlPipe,
    MatButtonModule,
    TranslocoPipe,
    TranslocoDirective,
    SpinnerComponent,
  ],
  templateUrl: './upload-barbershop-image-modal.component.html',
  styleUrl: './upload-barbershop-image-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadBarbershopImageModalComponent {
  #dialogRef = inject(MatDialogRef<UploadBarbershopImageModalComponent>);
  data: EditBarbershopData = inject(MAT_DIALOG_DATA);
  #barbershopConfigBrandStore = inject(BarbershopConfigBrandStore);
  barbershopLogo = this.#barbershopConfigBrandStore.logo;
  validators = [
    FileInputValidators.accept('image/*'),
    FileInputValidators.maxSize(20000000),
    Validators.required,
  ];
  isLoading = this.#barbershopConfigBrandStore.loading;
  profileImgForm = new FormControl<File | null>(null, [...this.validators]);
  photoPreview = signal<SafeResourceUrl | null>(null);
  readonly maxSize = 20000000;
  readonly I18N_PREFFIX_LOGO =
    'mfAdmin.barbershop-config.config-brand.upload-modal.logo.';
  readonly I18N_PREFFIX_IMAGE =
    'mfAdmin.barbershop-config.config-brand.upload-modal.image.';

  readonly maxSizeInMb = this.maxSize / 1000000;

  onImageChange(url: SafeResourceUrl | null): void {
    this.photoPreview.update(() => url);
  }

  uploadImage(): void {
    if (this.data.context === 'logo') {
      this.#barbershopConfigBrandStore.uploadNewBarbershopLogo({
        file: this.profileImgForm.value!,
        matDialogRef: this.#dialogRef,
      });
    } else {
      this.#barbershopConfigBrandStore.uploadNewBarbershopImage({
        file: this.profileImgForm.value!,
        matDialogRef: this.#dialogRef,
      });
    }
  }

  close(): void {
    this.#dialogRef.close();
  }
}
