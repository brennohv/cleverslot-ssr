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
import { IBarbershopPaymentDTO } from '@admin/barbershop-config/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { InputComponent, ModalBodyComponent } from 'ba-ngrx-signal-based';

@Component({
  selector: 'app-add-new-payment-modal',
  standalone: true,
  imports: [ModalBodyComponent, InputComponent, TranslocoPipe,
    TranslocoDirective, MatButton],
  templateUrl: './add-new-payment-modal.component.html',
  styleUrl: './add-new-payment-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewPaymentModalComponent implements OnInit {
  readonly I18N_PREFFIX =
    'mfAdmin.barbershop-config.config-payments.add-new-payment.';

  paymentFormControl = new FormControl('', { validators: Validators.required });
  isEditMode = signal<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IBarbershopPaymentDTO,
    private dialogRef: MatDialogRef<
      AddNewPaymentModalComponent,
      IBarbershopPaymentDTO | null
    >
  ) {}

  ngOnInit(): void {
    this.getDataFromInjection();
  }

  close(): void {
    this.dialogRef.close(null);
  }

  createEditPayment(): void {
    if (this.paymentFormControl.invalid) {
      return;
    }

    this.dialogRef.close({
      value: this.paymentFormControl.value!,
      ...(this.data?.id && { id: this.data?.id }),
    });
  }

  private getDataFromInjection() {
    if (this.data) {
      this.isEditMode.update(() => true);

      this.paymentFormControl.patchValue(this.data.value);
    }
  }
}
