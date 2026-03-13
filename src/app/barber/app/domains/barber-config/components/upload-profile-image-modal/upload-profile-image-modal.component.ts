import {
  ChangeDetectionStrategy,
  Component,
  Inject,
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
import { BarberConfigStore } from '@barber/barber-config/data/stores';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { IUploadFileDialogData } from '../../data/types';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-upload-profile-image-modal',
  standalone: true,
  imports: [
    ModalBodyComponent,
    FileUploadInputComponent,
    GetImgUrlPipe,
    MatButtonModule,
    TranslocoPipe,
    SpinnerComponent,
  ],
  templateUrl: './upload-profile-image-modal.component.html',
  styleUrl: './upload-profile-image-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadProfileImageModalComponent {
  #dialogRef = inject(MatDialogRef<UploadProfileImageModalComponent>);
  #barberConfigStore = inject(BarberConfigStore);
  barber = this.data.barber;
  uploadFileLoading = this.#barberConfigStore.uploadFileLoading;
  validators = [
    FileInputValidators.accept('image/*'),
    FileInputValidators.maxSize(20000000),
    Validators.required,
  ];
  profileImgForm = new FormControl<File | null>(null, [...this.validators]);
  photoPreview = signal<SafeResourceUrl | null>(null);
  readonly maxSize = 20000000;
  readonly I18N_PREFFIX = 'mfBarber.barber-config.upload-image-modal.';
  readonly maxSizeInMb = this.maxSize / 1000000;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IUploadFileDialogData) {}

  onImageChange(url: SafeResourceUrl | null): void {
    this.photoPreview.update(() => url);
  }

  uploadImage(): void {
    this.#barberConfigStore.uploadProfessionalImage({
      photoId: this.barber().photoId,
      file: this.profileImgForm.value!,
      matDialogRef: this.#dialogRef,
    });
  }

  close(): void {
    this.#dialogRef.close();
  }
}
