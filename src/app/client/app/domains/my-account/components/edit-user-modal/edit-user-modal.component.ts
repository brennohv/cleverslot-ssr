import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  InputComponent,
  UserStore,
  TelephoneInputComponent,
  InputPhone,
} from 'ba-ngrx-signal-based';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { getState } from '@ngrx/signals';
import {
  IEditUserDialodModel,
  IEditUserView,
} from '@client/my-account/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    TelephoneInputComponent,
    MatDialogActions,
    ReactiveFormsModule,
    MatButtonModule,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.scss',
})
export class EditUserModalComponent implements OnInit {
  readonly IEditUserView = IEditUserView;
  readonly I18N_PREFFIX = 'mfClient.my-account.edit-user-modal.';
  private userStore = inject(UserStore);
  userForm = this.fb.group({
    telephone: new FormControl<InputPhone>(
      {
        countryCode: '',
        dialCode: '',
        internationalNumber: '',
        number: '',
      },
      {
        nonNullable: true,
      }
    ),
  });
  telephone = this.userStore.telephone;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IEditUserDialodModel
  ) {}

  ngOnInit(): void {
    this.initUser();
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  changeUser(): void {
    const { telephone } = this.userForm.value;
    switch (this.data.contentView) {
      case IEditUserView.TELEPHONE:
        this.userStore.updateUser({ telephone: telephone as InputPhone });
        break;
    }

    this.closeModal();
  }

  private initUser(): void {
    const { telephone } = getState(this.userStore);

    if (telephone.internationalNumber) {
      this.userForm.controls.telephone.setValue(telephone);
    }
  }
}
