import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IBarbershopContactDTO } from '@admin/barbershop-config/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  InputPhone,
  ModalBodyComponent,
  TelephoneInputComponent,
} from 'ba-ngrx-signal-based';

@Component({
  selector: 'app-add-new-contact-modal',
  standalone: true,
  imports: [
    MatButton,
    TranslocoPipe,
    TranslocoDirective,
    ModalBodyComponent,
    TelephoneInputComponent,
  ],
  templateUrl: './add-new-contact-modal.component.html',
  styleUrl: './add-new-contact-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewContactModalComponent implements OnInit {
  readonly I18N_PREFFIX =
    'mfAdmin.barbershop-config.config-address-contact.contact.';

  isEditMode = signal<boolean>(false);
  telephoneForm = new FormControl<InputPhone>(
    { countryCode: '', dialCode: '', internationalNumber: '', number: '' },
    {
      validators: Validators.required,
      nonNullable: true,
    }
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IBarbershopContactDTO,
    private dialogRef: MatDialogRef<
      AddNewContactModalComponent,
      IBarbershopContactDTO | null
    >
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
      const { ...rest } = this.data;

      this.telephoneForm.patchValue({
        ...rest,
      });
    }
  }

  createEditAddress() {
    if (this.telephoneForm.invalid) {
      return;
    }

    const { number, internationalNumber, countryCode, dialCode } =
      this.telephoneForm.getRawValue();

    this.dialogRef.close({
      number,
      countryCode,
      dialCode,
      internationalNumber,
      ...(this.isEditMode() && { id: this.data?.id }),
    });
  }
}
