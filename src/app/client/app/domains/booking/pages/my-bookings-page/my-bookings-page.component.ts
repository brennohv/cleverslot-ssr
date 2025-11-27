import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {
  GetImgUrlPipe,
  SpinnerComponent,
  ValidationErrorPipe,
  UserStore,
  IStatus,
  DatePickerInputComponent,
} from 'ba-ngrx-signal-based';
import { Observable, firstValueFrom, map, startWith, tap } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import dayjs from 'dayjs';

import { AppointmenteListStore } from '@client/booking/data/stores';
import {
  DayFormatPipe,
  IsPastDatePipe,
  MonthFormatPipe,
} from '@client/booking/utils/pipes';

import { TimeFormatPipe } from '@client/shared/utils/pipes';
import { CancelAppointmentModalComponent } from '@client/booking/components';
@Component({
  selector: 'app-my-bookings-page',
  standalone: true,
  providers: [AppointmenteListStore],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    GetImgUrlPipe,
    MatButtonModule,
    TimeFormatPipe,
    DayFormatPipe,
    MonthFormatPipe,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    SpinnerComponent,
    IsPastDatePipe,
    RouterLink,
    DatePickerInputComponent,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './my-bookings-page.component.html',
  styleUrl: './my-bookings-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyBookingsPageComponent implements OnInit {
  #appointmentStore = inject(AppointmenteListStore);
  #userStore = inject(UserStore);
  userId = this.#userStore.documentId;
  isLoading = this.#appointmentStore.loading;
  isGetMoreLoading = this.#appointmentStore.getMoreLoading;
  appoitmentList = this.#appointmentStore.appointments;
  hasMoreAppointment = this.#appointmentStore.hasMoreDataFromService;
  filterForm = this.fb.group({
    startDate: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    endDate: new FormControl<Date | undefined>(undefined, {
      nonNullable: true,
    }),
  });

  minEndDate$ = this.filterForm.controls.startDate.valueChanges.pipe(
    startWith(this.filterForm.controls.startDate.value),
    map((date) => (dayjs(date).isValid() ? date : new Date()))
  );

  minEndDate = toSignal(this.minEndDate$);
  readonly IStatus = IStatus;
  readonly I18N_PREFFIX = 'mfClient.my-booking.';
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  constructor(public dialog: MatDialog, private fb: FormBuilder) {}

  ngOnInit(): void {
    const { startDate, endDate } = this.filterForm.getRawValue();
    if (this.userId()) {
      this.#appointmentStore.getAppointmentList(
        this.filterForm.valueChanges.pipe(startWith({ startDate, endDate }))
      );
    }

    this.clearEndDateSetup().subscribe();
  }

  getMoreSetup(): void {
    this.#appointmentStore.setNextPage();
  }

  clearEndDateSetup(): Observable<Date> {
    return this.filterForm.controls.startDate.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((value) => {
        if (value) {
          this.filterForm.controls.endDate.patchValue(undefined);
        }
      })
    );
  }

  navigateSetup(slug: string): void {
    this.router.navigate([slug]);
  }

  async openCancelAppointmentDialog(appointmentId: string): Promise<void> {
    const dialogRef = this.dialog.open(CancelAppointmentModalComponent, {});

    const closeResponse = await firstValueFrom(dialogRef.afterClosed());

    if (closeResponse === 'Yes') {
      this.#appointmentStore.cancelAppointment(appointmentId);
    }
  }
}
