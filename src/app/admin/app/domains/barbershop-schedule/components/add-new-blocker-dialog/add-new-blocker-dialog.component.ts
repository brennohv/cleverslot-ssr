import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  AlertService,
  DatePickerInputComponent,
  IInputType,
  InputComponent,
  ModalBodyComponent,
  SpinnerComponent,
} from 'ba-ngrx-signal-based';
import {
  DayOfWeek,
  DayOfWeekEnum,
  IScheduleBlockerDay,
  IBlockerDialogData,
  IBarberBlockerId,
} from '@admin/barbershop-schedule/data/types';
import { ScheduleService } from '@admin/barbershop-schedule/data/services';
import { tapResponse } from '@ngrx/operators';
import { first, map, startWith } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { BlockerWeekSelectorComponent } from '../blocker-week-selector/blocker-week-selector.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { FullCalendarStore } from '@admin/barbershop-schedule/data/stores';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

enum ContentView {
  DEFAULT = 'DEFAULT',
  DELETE_BLOCKER = 'DELETE_BLOCKER',
}
@Component({
  selector: 'app-add-new-blocker-dialog',
  standalone: true,
  imports: [
    BlockerWeekSelectorComponent,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    InputComponent,
    SpinnerComponent,
    ModalBodyComponent,
    MatIcon,
    DatePickerInputComponent,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './add-new-blocker-dialog.component.html',
  styleUrl: './add-new-blocker-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewBlockerDialogComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-schedule.blocker-dialog.';
  dialogRef = inject(MatDialogRef<AddNewBlockerDialogComponent>);
  #scheduleService = inject(ScheduleService);
  #fullCalendarStore = inject(FullCalendarStore);
  #alertService = inject(AlertService);
  blockerForm = new FormGroup({
    daysOfWeek: new FormControl<Partial<DayOfWeek[]>>([], {
      validators: Validators.required,
      nonNullable: true,
    }),
    startDate: new FormControl<Date>(new Date(), {
      validators: Validators.required,
    }),
    endDate: new FormControl<Date>(new Date(), {
      validators: Validators.required,
    }),
    startTime: new FormControl<string>('', { validators: Validators.required }),
    endTime: new FormControl<string>('', { validators: Validators.required }),
  });
  isCreationScheduleBlockerLoading = signal(false);
  isEditMode = !!this.data?.blockerId;
  contentView = signal<ContentView>(ContentView.DEFAULT);
  defaultDays = signal<IScheduleBlockerDay[]>([
    {
      dayOfWeek: DayOfWeekEnum.MONDAY,
      abbreviation: 'abbreviation-monday',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.TUESDAY,
      abbreviation: 'abbreviation-tuesday',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.WEDNESDAY,
      abbreviation: 'abbreviation-wednesday',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.THURSDAY,
      abbreviation: 'abbreviation-thursday',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.FRIDAY,
      abbreviation: 'abbreviation-friday',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.SATURDAY,
      abbreviation: 'abbreviation-saturday',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.SUNDAY,
      abbreviation: 'abbreviation-sunday',
      selected: true,
    },
  ]);

  minEndDate$ = this.blockerForm.controls.startDate.valueChanges.pipe(
    startWith(this.blockerForm.controls.startDate.value),
    map((date) => (dayjs(date).isValid() ? date : new Date()))
  );
  minEndDate = toSignal(this.minEndDate$);

  readonly ContentView = ContentView;
  readonly IInputType = IInputType;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IBlockerDialogData) {}

  ngOnInit(): void {
    this.getDataFromInjection();
  }

  setDaysOfWeek(days: IScheduleBlockerDay[]): void {
    const onlySelectedDays = days.filter((day) => !!day.selected);
    this.blockerForm.controls.daysOfWeek.patchValue(
      onlySelectedDays.length ? onlySelectedDays : []
    );
  }

  close(): void {
    this.dialogRef.close();
  }

  createBlocker(): void {
    if (this.blockerForm.valid) {
      this.isCreationScheduleBlockerLoading.update(() => true);
      const { daysOfWeek, endDate, endTime, startDate, startTime } =
        this.blockerForm.getRawValue();
      this.#scheduleService
        .createScheduleBlocker({
          barber: this.#fullCalendarStore.professionalId(),
          daysOfWeek: daysOfWeek?.map((day) => ({
            dayOfWeek: day?.dayOfWeek,
          })) as DayOfWeek[],
          endDate: dayjs(endDate).format('YYYY-MM-DD'),
          startDate: dayjs(startDate).format('YYYY-MM-DD'),
          startTime: dayjs(startTime, 'HH:mm').format('HH:mm:ss'),
          endTime: dayjs(endTime, 'HH:mm').format('HH:mm:ss'),
        })
        .pipe(
          first(),
          tapResponse({
            next: (resp) => {
              if (!resp?.error) {
                this.closeModalAndReturnDate(
                  startDate,
                  startTime,
                  this.I18N_PREFFIX + 'blocker-created-msg'
                );
              }
            },
            error: console.error,
            finalize: () => {
              this.isCreationScheduleBlockerLoading.update(() => false);
            },
          })
        )
        .subscribe();
    }
  }

  editBlocker(): void {
    if (this.blockerForm.valid) {
      this.isCreationScheduleBlockerLoading.update(() => true);
      const { daysOfWeek, endDate, endTime, startDate, startTime } =
        this.blockerForm.getRawValue();
      this.#scheduleService
        .editScheduleBlocker({
          barber: this.#fullCalendarStore.professionalId(),
          daysOfWeek: daysOfWeek?.map((day) => ({
            dayOfWeek: day?.dayOfWeek,
          })) as DayOfWeek[],
          endDate: dayjs(endDate).format('YYYY-MM-DD'),
          startDate: dayjs(startDate).format('YYYY-MM-DD'),
          startTime: dayjs(startTime, 'HH:mm').format('HH:mm:ss'),
          endTime: dayjs(endTime, 'HH:mm').format('HH:mm:ss'),
          blockerId: this.data.blockerId as string,
        })
        .pipe(
          first(),
          tapResponse({
            next: (resp) => {
              if (!resp?.error) {
                this.closeModalAndReturnDate(
                  startDate,
                  startTime,
                  this.I18N_PREFFIX + 'blocker-edited-msg'
                );
              }
            },
            error: console.error,
            finalize: () => {
              this.isCreationScheduleBlockerLoading.update(() => false);
            },
          })
        )
        .subscribe();
    }
  }

  deleteBlocker(): void {
    if (this.blockerForm.valid) {
      this.isCreationScheduleBlockerLoading.update(() => true);
      const { startDate, startTime } = this.blockerForm.getRawValue();
      this.#scheduleService
        .deleteScheduleBlocker({ blockerId: this.data.blockerId as string })
        .pipe(
          first(),
          tapResponse({
            next: (resp) => {
              if (!resp?.error) {
                this.closeModalAndReturnDate(
                  startDate,
                  startTime,
                  this.I18N_PREFFIX + 'blocker-deleted-msg'
                );
              }
            },
            error: console.error,
            finalize: () => {
              this.isCreationScheduleBlockerLoading.update(() => false);
            },
          })
        )
        .subscribe();
    }
  }

  changeContentView(view: ContentView): void {
    this.contentView.update(() => view);
  }

  private closeModalAndReturnDate(
    startDate: Date | null,
    startTime: string | null,
    message: string
  ): void {
    this.#alertService.showSuccess(message);
    const dateString = dayjs(startDate).format('YYYY-MM-DD');
    const startTimeString = dayjs(startTime, 'HH:mm').format('HH:mm:ss');
    const returnModal = dayjs(`${dateString} ${startTimeString}`);
    this.dialogRef.close(returnModal);
  }

  private getDataFromInjection(): void {
    const { date, blockerId } = this.data;

    if (blockerId) {
      this.#scheduleService
        .getBlockerById(blockerId)
        .pipe(
          first(),
          tapResponse({
            next: (resp) => {
              if (!resp?.error && resp.data) {
                this.setFormByBlockerResponse(resp.data.scheduleBlocker);
              }
            },
            error: console.error,
            finalize: () => {
              this.isCreationScheduleBlockerLoading.update(() => false);
            },
          })
        )
        .subscribe();
    } else {
      this.blockerForm.controls.startDate.patchValue(
        new Date(date!.format('YYYY-MM-DD'))
      );
      this.blockerForm.controls.endDate.patchValue(
        new Date(date!.format('YYYY-MM-DD'))
      );
    }
  }

  private setFormByBlockerResponse(scheduleBlocker: IBarberBlockerId): void {
    const { daysOfWeek, endDate, endTime, startDate, startTime } =
      scheduleBlocker;

    this.blockerForm.controls.startDate.patchValue(new Date(startDate));
    this.blockerForm.controls.endDate.patchValue(new Date(endDate));
    this.blockerForm.controls.startTime.patchValue(startTime);
    this.blockerForm.controls.endTime.patchValue(endTime);
    this.blockerForm.controls.daysOfWeek.patchValue(daysOfWeek);

    this.defaultDays.update((days) =>
      days.map((day) => ({
        ...day,
        selected: daysOfWeek.some((d) => d.dayOfWeek === day.dayOfWeek),
      }))
    );
  }
}
