import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import {
  GetImgUrlPipe,
  SpinnerComponent,
  IFreeSlot,
  DatePickerInputComponent,
  ModalBodyComponent,
} from 'ba-ngrx-signal-based';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatChipSelectionChange,
  MatChipsModule,
  MatChipListbox,
} from '@angular/material/chips';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

import { FreeSlotsStore } from '@client/barbershop-overview/data/stores';

import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  FreeSlotsModalData,
  IBarberFreeSlots,
} from '@client/barbershop-overview/data/types';
import { specificDateFormatAndFutureValidator } from '@client/barbershop-overview/utils';
import { NextDayDateFormatPipe } from '@client/barbershop-overview/utils/pipes';

@Component({
  selector: 'app-free-slots-dialog',
  standalone: true,
  imports: [
    NgIf,
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
    DatePickerInputComponent,
    TranslocoPipe,
    TranslocoDirective,
    ModalBodyComponent,
    AsyncPipe,
    NextDayDateFormatPipe,
  ],
  providers: [FreeSlotsStore],
  templateUrl: './free-slots-dialog.component.html',
  styleUrl: './free-slots-dialog.component.scss',
})
export class FreeSlotsDialogComponent implements OnInit {
  #freeSlotsStore = inject(FreeSlotsStore);
  #cdr = inject(ChangeDetectorRef);
  today = new Date();
  isProfessionalLoading = this.#freeSlotsStore.professionalLoading;
  isCreationAppointmentLoading =
    this.#freeSlotsStore.appointmentCreationLoading;
  isFreeSlotContentReady = this.#freeSlotsStore.isFreeSlotContentReady;
  freeSlotsList = this.#freeSlotsStore.freeSlotsList;
  professionalList = this.#freeSlotsStore.professionalList;
  weekSlotList = this.#freeSlotsStore.weekSlotList;
  selectedSlot = this.#freeSlotsStore.selectedSlot;
  isNextAvailabilityView = this.#freeSlotsStore.isNextAvailabilityView;
  noSlotsWeekAvailability = this.#freeSlotsStore.noSlotsWeekAvailability;
  dateEffect = effect(() => {
    this.freeSlotsForm.controls.date.patchValue(this.#freeSlotsStore.date()!, {
      emitEvent: false,
    });
  });

  freeSlotsForm = this.fb.group({
    barberId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required, specificDateFormatAndFutureValidator()],
    }),
  });

  chipListBox = viewChild<MatChipListbox>('chipListBox');

  readonly I18N_PREFFIX = 'mfClient.barbershop-overview.free-slots.';

  constructor(
    public dialogRef: MatDialogRef<FreeSlotsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FreeSlotsModalData,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.#freeSlotsStore.setBarbershopId(this.data.barbershopId);
    this.#freeSlotsStore.setServiceId(this.data.serviceId);
    this.#freeSlotsStore.getProfessionalList();
    this.#freeSlotsStore.getFreeSlots(this.freeSlotsForm.valueChanges);
  }

  close(): void {
    this.dialogRef.close();
  }

  createAppointment(): void {
    if (this.freeSlotsForm.valid && !!this.selectedSlot().startTime) {
      this.#freeSlotsStore.createAppointment(this.dialogRef);
    }
  }

  professionalChange(
    event: MatChipSelectionChange,
    professional: IBarberFreeSlots
  ): void {
    if (!event.selected) {
      this.freeSlotsForm.controls.barberId.patchValue('');
      this.#freeSlotsStore.clearFreeSlotList();
      return;
    }

    this.freeSlotsForm.controls.barberId.patchValue(professional.documentId);
  }

  slotChange(event: MatChipSelectionChange, slot: IFreeSlot): void {
    if (!event.selected) {
      this.#freeSlotsStore.setSeletedSlot({
        date: '',
        endTime: '',
        startTime: '',
      });
      return;
    }
    this.#freeSlotsStore.setSeletedSlot(slot);
  }

  getSlotsBasedOnNextDay(event: MatChipSelectionChange, date: string): void {
    this.removeSelectedChipScreenSetup(date);
    this.#freeSlotsStore.getSlotsBasedOnNextDay(date);
  }

  nextAvailabilitySetup(): void {
    this.#freeSlotsStore.getFreeSlots({
      nextAvailability: true,
      ...this.freeSlotsForm.value,
    });
  }

  private removeSelectedChipScreenSetup(date: string) {
    const hasSlots = this.freeSlotsList()?.length;
    const slotDate = this.freeSlotsList()?.[0]?.date;
    if (hasSlots && slotDate !== date) {
      this.freeSlotsForm.controls.date.patchValue(new Date(date), {
        emitEvent: false,
      });
      this.chipListBox()?._setSelectionByValue(null);
      this.#cdr.detectChanges();
    }
  }
}
