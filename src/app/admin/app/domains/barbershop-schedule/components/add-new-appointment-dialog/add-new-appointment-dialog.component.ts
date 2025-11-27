import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  DatePickerInputComponent,
  GetImgUrlPipe,
  IFreeSlot,
  IInputType,
  INonRegisteredUser,
  IStatus,
  InputComponent,
  InputPhone,
  ModalBodyComponent,
  SpinnerComponent,
  TelephoneInputComponent,
  ValidationErrorPipe,
} from 'ba-ngrx-signal-based';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatChipSelectionChange,
  MatChipsModule,
} from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';

import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { NewAppointmentBarberStore } from '@admin/barbershop-schedule/data/stores';
import {
  IClientsFromBarbershop,
  INewAppointmentDialogData,
  IBarberAppoitmentId,
  IClientView,
} from '@admin/barbershop-schedule/data/types';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, combineLatest, filter, map } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

// Enable the plugin at the top of your file
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

enum ContentView {
  DEFAULT = 'DEFAULT',
  CANCEL_APPOINTMENT = 'CANCEL_APPOINTMENT',
}

@Component({
  selector: 'app-add-new-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    GetImgUrlPipe,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    SpinnerComponent,
    MatSelectModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    InputComponent,
    TelephoneInputComponent,
    ValidationErrorPipe,
    ModalBodyComponent,
    DatePickerInputComponent,
    TranslocoPipe,
    TranslocoDirective,
    GetImgUrlPipe,
    MatButtonToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './add-new-appointment-dialog.component.html',
  styleUrl: './add-new-appointment-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewAppointmentDialogComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-schedule.new-appointment.';
  #newAppointmentBarberStore = inject(NewAppointmentBarberStore);
  #cdr = inject(ChangeDetectorRef);
  serviceList = this.#newAppointmentBarberStore.serviceList;
  freeSlotsList = this.#newAppointmentBarberStore.freeSlotsList;
  clientList = this.#newAppointmentBarberStore.clientList;
  isEditMode = !!this.data?.appointment;
  appointmentEditData = this.#newAppointmentBarberStore.appointmentEdit;
  hasRequestedClientList = signal(false);
  isServiceLoading = this.#newAppointmentBarberStore.serviceListLoading;
  isClientLoading = this.#newAppointmentBarberStore.clientListLoading;
  isLoading = this.#newAppointmentBarberStore.loading;
  isCreationAppointmentLoading =
    this.#newAppointmentBarberStore.appointmentCreationLoading;
  selectedSlot = this.#newAppointmentBarberStore.selectedSlot;
  newAppointmentForm = new FormGroup({
    serviceId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  registeredUserForm = new FormControl<IClientsFromBarbershop | null>(null, {
    nonNullable: true,
    validators: Validators.required,
  });
  clientView = this.#newAppointmentBarberStore.clientView;
  isAccommodationSlotView =
    this.#newAppointmentBarberStore.isAccommodationSlotView;
  nonRegisteredUserForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    telephone: new FormControl<InputPhone>(
      { countryCode: '', dialCode: '', internationalNumber: '', number: '' },
      {
        nonNullable: true,
        validators: Validators.required,
      }
    ),
  });
  newClientForm = new FormGroup({
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
  accommodationSlotForm = new FormGroup({
    startTime: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
    endTime: new FormControl<string>('', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });
  readonly TODAY = new Date();
  readonly IStatus = IStatus;
  readonly ContentView = ContentView;
  readonly IInputType = IInputType;
  readonly IClientView = IClientView;

  @ViewChild('clientListInput') clientListInput?: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: INewAppointmentDialogData,
    public dialogRef: MatDialogRef<AddNewAppointmentDialogComponent>
  ) {}

  ngOnInit(): void {
    this.#newAppointmentBarberStore.getServiceList();
    this.#newAppointmentBarberStore.getFreeSlots(
      this.newAppointmentForm.valueChanges.pipe(
        filter(() => !this.isAccommodationSlotView())
      )
    );
    this.#newAppointmentBarberStore.setSeletedClient(this.onClientChange());
    this.#newAppointmentBarberStore.setNonRegisteredClient(
      this.nonRegisteredUserForm.valueChanges as Partial<INonRegisteredUser>
    );

    this.#newAppointmentBarberStore.setAccommodationSlotTime(
      combineLatest({
        accomodationForm: this.accommodationSlotForm.valueChanges,
        dateForm: this.newAppointmentForm.controls.date.valueChanges,
      })
    );

    this.#newAppointmentBarberStore.setNewClient(
      this.newClientForm.valueChanges
    );

    this.getDataFromInjection();
  }

  getClientList() {
    if (!this.hasRequestedClientList()) {
      this.hasRequestedClientList.update(() => true);
    }
    const filterValue =
      this.clientListInput?.nativeElement.value.toLowerCase() || '';
    this.#newAppointmentBarberStore.getClientList(filterValue);
  }

  onClientViewChange(value: IClientView): void {
    this.#newAppointmentBarberStore.setClientView(value);
  }

  onSlotViewChange(isAccommodationSlotView: boolean): void {
    if (!isAccommodationSlotView) {
      this.#newAppointmentBarberStore.clearSelectedSlot();
      const { date, serviceId } = this.newAppointmentForm.getRawValue();
      this.#newAppointmentBarberStore.getFreeSlots({ serviceId, date });
    }

    if (isAccommodationSlotView) {
      this.accommodationSlotForm.patchValue({
        startTime: this.selectedSlot.startTime(),
        endTime: this.selectedSlot.endTime(),
      });
    }

    this.#newAppointmentBarberStore.setSlotView(isAccommodationSlotView);
  }

  displayFn(client: IClientsFromBarbershop): string {
    return client && client.username ? client.username : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  slotChange(event: MatChipSelectionChange, slot: IFreeSlot): void {
    if (!event.selected) {
      this.#newAppointmentBarberStore.clearSelectedSlot();
      return;
    }
    this.#newAppointmentBarberStore.setSeletedSlot(slot);
  }

  createAndEditAppointment(): void {
    const formMapByView = {
      REGISTERED: this.registeredUserForm,
      NON_REGISTERED: this.nonRegisteredUserForm,
      NEW_CLIENT: this.newClientForm,
    };
    const isUserFormValid = formMapByView[this.clientView()].valid;

    if (isUserFormValid && this.newAppointmentForm.valid) {
      this.#newAppointmentBarberStore.createAndEditAppointment(this.dialogRef);
    } else {
      this.nonRegisteredUserForm.markAllAsTouched();
      this.registeredUserForm.markAllAsTouched();
      this.newClientForm.markAllAsTouched();
    }

    this.#cdr.detectChanges();
  }

  private onClientChange(): Observable<string | null> {
    return this.registeredUserForm.valueChanges.pipe(
      map((client) => client?.documentId || null)
    );
  }

  private getDataFromInjection(): void {
    const { date, appointment } = this.data;

    if (appointment) {
      this.setFormByAppointmentInjection(appointment);
      this.accommodationSlotForm.patchValue({
        endTime: dayjs(appointment.endTime, 'HH:mm:ss').format('HH:mm'),
        startTime: dayjs(appointment.startTime, 'HH:mm:ss').format('HH:mm'),
      });
    } else {
      this.newAppointmentForm.controls.date.patchValue(
        new Date(date!.format('YYYY-MM-DD'))
      );
    }
  }

  private setFormByAppointmentInjection(appointment: IBarberAppoitmentId) {
    this.newAppointmentForm.controls.date?.patchValue(
      new Date(appointment.date)
    );
    this.newAppointmentForm.controls.serviceId.patchValue(
      appointment.service.documentId
    );

    this.#newAppointmentBarberStore.setSeletedSlot({
      date: appointment.date,
      endTime: dayjs(appointment.endTime, 'HH:mm:ss').format('HH:mm'),
      startTime: dayjs(appointment.startTime, 'HH:mm:ss').format('HH:mm'),
    });

    if (appointment.client) {
      this.registeredUserForm.patchValue(appointment.client);
    }

    if (appointment.nonRegisteredUser) {
      this.onClientViewChange(IClientView.NON_REGISTERED);
      this.nonRegisteredUserForm.controls.name.patchValue(
        appointment.nonRegisteredUser.name
      );
      this.nonRegisteredUserForm.controls.telephone.patchValue(
        appointment.nonRegisteredUser.telephone
          .internationalNumber as unknown as InputPhone
      );
    }
  }
}
