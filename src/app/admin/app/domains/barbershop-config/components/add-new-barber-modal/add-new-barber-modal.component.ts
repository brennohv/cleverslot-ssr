import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SafeResourceUrl } from '@angular/platform-browser';
import { BarbershopConfigBarberStore } from '@admin/barbershop-config/data/stores';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  FileUploadInputComponent,
  GetImgUrlPipe,
  IInputType,
  InputComponent,
  InputPhone,
  ModalBodyComponent,
  TelephoneInputComponent,
  UserStore,
  FileInputValidators,
  SpinnerComponent,
} from 'ba-ngrx-signal-based';
import { map, startWith, tap } from 'rxjs';

@Component({
  selector: 'app-add-new-barber-modal',
  standalone: true,
  imports: [
    ModalBodyComponent,
    InputComponent,
    TranslocoPipe,
    TranslocoDirective,
    FileUploadInputComponent,
    MatButton,
    GetImgUrlPipe,
    TelephoneInputComponent,
    ReactiveFormsModule,
    MatSlideToggleModule,
    SpinnerComponent,
  ],
  templateUrl: './add-new-barber-modal.component.html',
  styleUrl: './add-new-barber-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewBarberModalComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.barbers.add-new-barber.';
  readonly maxSize = 20000000;
  readonly maxSizeInMb = this.maxSize / 1000000;
  readonly IInputType = IInputType;
  #barbershopConfigBarberStore = inject(BarbershopConfigBarberStore);
  #userStore = inject(UserStore);
  isLoading = this.#barbershopConfigBarberStore.loading;

  newBarberForm = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    password: new FormControl(
      { disabled: true, value: '' },
      {
        nonNullable: true,
        validators: Validators.required,
      }
    ),
    telephone: new FormControl<InputPhone>(
      { countryCode: '', dialCode: '', internationalNumber: '', number: '' },
      {
        nonNullable: true,
        validators: Validators.required,
      }
    ),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    photo: new FormControl<File | null>(null, [
      FileInputValidators.accept('image/*'),
      FileInputValidators.maxSize(20000000),
    ]),
  });

  userAsProfessionalForm = new FormControl<boolean>(false, {
    nonNullable: true,
  });

  isUserAsProfessionalView =
    this.#barbershopConfigBarberStore.userAsProfessionalView;

  hasProfessionalProfile = this.#userStore.barber;
  photoPreviewFromPhotoChange = signal<SafeResourceUrl | null>(null);
  photoPreviewFromInjection = signal<string | null>(null);
  isEditMode = signal<boolean>(false);

  constructor(private dialogRef: MatDialogRef<AddNewBarberModalComponent>) {}

  ngOnInit(): void {
    this.newBarberForm.patchValue({
      password: this.#userStore.admin().barbershopSlug + '_new_barber',
    });

    this.#barbershopConfigBarberStore.updateValidatorBasedOnView(
      this.userAsProfessionalForm.valueChanges.pipe(
        startWith(false),
        tap((isUserAsProfessionalView) => {
          if (isUserAsProfessionalView && this.#userStore.photoUrl()) {
            this.photoPreviewFromInjection.set(this.#userStore.photoUrl());
            return;
          }
          this.photoPreviewFromInjection.set(null);
        }),
        map((isUserAsProfessionalView) => ({
          userAsProfessionalView: isUserAsProfessionalView,
          formGroup: this.newBarberForm,
        }))
      )
    );
  }

  onImageChange(url: SafeResourceUrl | null): void {
    this.photoPreviewFromPhotoChange.update(() => url);
  }

  close(): void {
    this.dialogRef.close(null);
  }

  createNewBarber(): void {
    if (this.newBarberForm.invalid) {
      return;
    }

    const { email, firstName, lastName, password, photo, telephone, username } =
      this.newBarberForm.getRawValue();

    this.#barbershopConfigBarberStore.addNewBarber({
      email,
      firstName,
      lastName,
      password,
      photo,
      telephone,
      username,
      dialogRef: this.dialogRef,
    });
  }
}
