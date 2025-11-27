import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { BarbershopConfigClientStore } from '@admin/barbershop-config/data/stores';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  IInputType,
  InputComponent,
  InputPhone,
  ModalBodyComponent,
  SpinnerComponent,
  TelephoneInputComponent,
  UserStore,
} from 'ba-ngrx-signal-based';

@Component({
  selector: 'app-add-new-client-modal',
  standalone: true,
  imports: [
    ModalBodyComponent,
    InputComponent,
    TranslocoPipe,
    TranslocoDirective,
    MatButton,
    TelephoneInputComponent,
    SpinnerComponent,
  ],
  templateUrl: './add-new-client-modal.component.html',
  styleUrl: './add-new-client-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewClientModalComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.clients.add-new-client.';
  readonly IInputType = IInputType;
  #barbershopConfigClientStore = inject(BarbershopConfigClientStore);
  #userStore = inject(UserStore);
  isLoading = this.#barbershopConfigClientStore.loading;

  newClientForm = new FormGroup({
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
  });
  isEditMode = signal<boolean>(false);

  constructor(private dialogRef: MatDialogRef<AddNewClientModalComponent>) {}

  ngOnInit(): void {
    this.newClientForm.patchValue({
      password: this.#userStore.admin().barbershopSlug + '_new_client',
    });
  }

  close(): void {
    this.dialogRef.close(null);
  }

  createNewBarber(): void {
    if (this.newClientForm.invalid) {
      return;
    }

    const { email, password, telephone, username } =
      this.newClientForm.getRawValue();

    this.#barbershopConfigClientStore.addNewClient({
      email,
      password,
      telephone,
      username,
      dialogRef: this.dialogRef,
    });
  }
}
