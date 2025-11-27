import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { BarbershopConfigBrandStore } from '@admin/barbershop-config/data/stores';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  InputComponent,
  ModalBodyComponent,
  SpinnerComponent,
} from 'ba-ngrx-signal-based';

export interface EditBarbershopNameData {
  name: string;
}

@Component({
  selector: 'app-edit-barbershop-name-modal',
  standalone: true,
  imports: [
    MatButton,
    TranslocoPipe,
    TranslocoDirective,
    ModalBodyComponent,
    InputComponent,
    SpinnerComponent,
  ],
  templateUrl: './edit-barbershop-name-modal.component.html',
  styleUrl: './edit-barbershop-name-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditBarbershopNameModalComponent implements OnInit {
  readonly I18N_PREFFIX =
    'mfAdmin.barbershop-config.config-brand.edit-name-modal.';
  #dialogRef = inject(MatDialogRef<EditBarbershopNameModalComponent>);
  #barbershopConfigBrandStore = inject(BarbershopConfigBrandStore);
  isLoading = this.#barbershopConfigBrandStore.loading;
  nameFormControl = new FormControl<string>('', {
    validators: Validators.required,
    nonNullable: true,
  });

  ngOnInit(): void {
    this.nameFormControl.setValue(this.#barbershopConfigBrandStore.name());
  }

  close(): void {
    this.#dialogRef.close(null);
  }

  editBarbershopName(): void {
    if (this.nameFormControl.valid) {
      this.#barbershopConfigBrandStore.editBarbershopName({
        name: this.nameFormControl.value,
        matDialogRef: this.#dialogRef,
      });
    }
  }
}
