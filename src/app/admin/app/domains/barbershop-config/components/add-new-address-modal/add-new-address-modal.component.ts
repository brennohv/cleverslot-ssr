import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IBarbershopAddressDTO } from '@admin/barbershop-config/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  IInputType,
  InputComponent,
  ModalBodyComponent,
} from 'ba-ngrx-signal-based';

@Component({
  selector: 'app-add-new-address-modal',
  standalone: true,
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    ModalBodyComponent,
    InputComponent,
    MatButton,
  ],
  templateUrl: './add-new-address-modal.component.html',
  styleUrl: './add-new-address-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewAddressModalComponent implements OnInit {
  readonly I18N_PREFFIX =
    'mfAdmin.barbershop-config.config-address-contact.address.';
  readonly IInputType = IInputType;
  newAddressForm = this.fb.group({
    street: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    number: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    complement: new FormControl<string>('', {
      nonNullable: true,
    }),
    postalCode: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    city: new FormControl<string>('', {
      nonNullable: true,
    }),
    country: new FormControl<string>('', {
      nonNullable: true,
    }),
  });
  isEditMode = signal<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IBarbershopAddressDTO | null,
    private dialogRef: MatDialogRef<
      AddNewAddressModalComponent,
      IBarbershopAddressDTO | null
    >,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDataFromInjection();
  }

  close(): void {
    this.dialogRef.close(null);
  }

  private getDataFromInjection() {
    if (this.data) {
      this.isEditMode.update(() => true);
      const { number, postalCode, street, city, complement, country } =
        this.data;

      this.newAddressForm.patchValue({
        number,
        postalCode,
        street,
        city,
        complement,
        country,
      });
    }
  }

  createEditAddress() {
    if (this.newAddressForm.invalid) {
      return;
    }

    const { number, postalCode, street, city, complement, country } =
      this.newAddressForm.getRawValue();

    this.dialogRef.close({
      number,
      postalCode,
      street,
      city,
      complement,
      country,
      ...(this.isEditMode() && { id: this.data?.id }),
    });
  }
}
