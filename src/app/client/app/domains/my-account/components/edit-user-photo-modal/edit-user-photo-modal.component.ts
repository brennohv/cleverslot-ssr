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
  UserStore,
  FileInputValidators,
  SpinnerComponent,
} from 'ba-ngrx-signal-based';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-edit-user-photo-modal',
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
  templateUrl: './edit-user-photo-modal.component.html',
  styleUrl: './edit-user-photo-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserPhotoModalComponent {
  #dialogRef = inject(MatDialogRef<EditUserPhotoModalComponent>);
  #userStore = inject(UserStore);
  userPhoto = this.#userStore.photoUrl;
  uploadFileLoading = this.#userStore.uploadFileLoading;
  validators = [
    FileInputValidators.accept('image/*'),
    FileInputValidators.maxSize(20000000),
    Validators.required,
  ];
  profileImgForm = new FormControl<File | null>(null, [...this.validators]);
  photoPreview = signal<SafeResourceUrl | null>(null);
  readonly maxSize = 20000000;
  readonly I18N_PREFFIX = 'mfClient.my-account.edit-user-photo-modal.';
  readonly maxSizeInMb = this.maxSize / 1000000;

  onImageChange(url: SafeResourceUrl | null): void {
    this.photoPreview.update(() => url);
  }

  uploadImage(): void {
    this.#userStore.uploadUserClientPhoto({
      file: this.profileImgForm.value!,
      matDialogRef: this.#dialogRef,
    });
  }

  close(): void {
    this.#dialogRef.close();
  }
}
