import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent, TelephoneInputComponent } from 'ba-ngrx-signal-based';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  IEditProfessionalModalData,
  IEditProfessionalView,
} from '@barber/barber-config/data/types';
import { BarberConfigStore } from '@barber/barber-config/data/stores';

@Component({
  selector: 'app-edit-professional-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    InputComponent,
    TelephoneInputComponent,
    MatDialogActions,
    ReactiveFormsModule,
    MatButtonModule,
    TranslocoPipe,
  ],
  templateUrl: './edit-professional-modal.component.html',
  styleUrl: './edit-professional-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfessionalModalComponent implements OnInit {
  readonly IEditProfessionalView = IEditProfessionalView;
  readonly I18N_PREFFIX =
    'mfBarber.barber-config.config-profile.professional-edit-name.';
  #barberConfigStore = inject(BarberConfigStore);
  barber = this.#barberConfigStore.barber;
  formControl = new FormControl();

  constructor(
    public dialogRef: MatDialogRef<EditProfessionalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IEditProfessionalModalData,
  ) {}

  ngOnInit(): void {
    this.initUser();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  changeUser(): void {
    this.#barberConfigStore.editProfessionalName({
      view: this.data.contentView,
      formValue: this.formControl.value,
      matDialogRef: this.dialogRef,
    });
  }

  private initUser(): void {
    if (this.data.contentView === IEditProfessionalView.FIRST_NAME) {
      this.formControl.setValue(this.barber.firstName());
    }
    if (this.data.contentView === IEditProfessionalView.LAST_NAME) {
      this.formControl.setValue(this.barber.lastName());
    }
  }
}
