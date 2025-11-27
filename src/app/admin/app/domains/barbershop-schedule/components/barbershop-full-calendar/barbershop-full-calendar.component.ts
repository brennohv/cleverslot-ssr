import {
  Component,
  ChangeDetectorRef,
  inject,
  ViewChild,
  computed,
  Injector,
  AfterContentInit,
  ChangeDetectionStrategy,
  input,
  OnInit,
  DestroyRef,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import {
  CalendarOptions,
  EventClickArg,
  DatesSetArg,
  BusinessHoursInput,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  NewAppointmentBarberStore,
  FullCalendarStore,
} from '@admin/barbershop-schedule/data/stores';
import { WeekDayToNumber } from '@admin/barbershop-schedule/utils';
import { GetImgUrlPipe, SpinnerDirective } from 'ba-ngrx-signal-based';
import {
  AddNewAppointmentDialogComponent,
  AppointmentDetailedDialogComponent,
  CalendarEventComponent,
} from '@admin/barbershop-schedule/components';
import { MatDialog } from '@angular/material/dialog';
import dayjs from 'dayjs';
import {
  filter,
  first,
  interval,
  Observable,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import {
  IAppointmentDetailedDialogData,
  IBarberAppoitmentId,
  IBlockerDialogData,
  IBusinessHour,
  IDetailedAppointmentDialogResp,
  IDetailedView,
  INewAppointmentDialogData,
} from '@admin/barbershop-schedule/data/types';

import {
  FeatureAddNewEventComponent,
  AddNewBlockerDialogComponent,
  DatePickerDialogComponent,
} from '@admin/barbershop-schedule/components';
import { MatMenuModule } from '@angular/material/menu';
import { TranslocoService } from '@jsverse/transloco';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { IProfessional } from '@admin/shared/data/types';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

@Component({
  selector: 'app-barbershop-full-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    FeatureAddNewEventComponent,
    MatMenuModule,
    SpinnerDirective,
    GetImgUrlPipe,
    CalendarEventComponent,
    MatCardModule,
  ],
  providers: [FullCalendarStore, NewAppointmentBarberStore],
  templateUrl: './barbershop-full-calendar.component.html',
  styleUrl: './barbershop-full-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopFullCalendarComponent
  implements AfterContentInit, OnInit
{
  #fullCalendarStore = inject(FullCalendarStore);
  #dialog = inject(MatDialog);
  #injector = inject(Injector);
  #platformId = inject(PLATFORM_ID);
  #lang = toSignal(
    this.translocoService.langChanges$.pipe(
      startWith(
        isPlatformBrowser(this.#platformId)
          ? localStorage.getItem('language') || 'pt'
          : 'pt'
      )
    )
  );
  #destroyRef = inject(DestroyRef);
  isLoading = this.#fullCalendarStore.loading;
  currentDate: string;
  professional = input.required<IProfessional>();
  businessHours = input.required<IBusinessHour[]>();
  calendarOptionsComputed = computed<CalendarOptions>(() => {
    return {
      locale: this.#lang(),
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin],
      customButtons: {
        datePickerButton: {
          click: () => {
            this.openDatePickerDialog();
          },
        },
      },
      headerToolbar: {
        left: 'datePickerButton,title',
        right: 'prev,next',
      },
      titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
      ...(this.businessHourListSetup().length && {
        businessHours: this.businessHourListSetup(),
      }),
      initialView: 'timeGridDay',
      contentHeight: 350,
      allDaySlot: false,
      weekends: true,
      editable: true,
      selectable: false,
      selectMirror: true,
      dayMaxEvents: true,
      nowIndicator: true,
      slotDuration: '00:30:00',
      slotLabelInterval: '00:30',
      slotMinTime: '06:00:00',
      slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        omitZeroMinute: false,
        meridiem: false,
        hour12: false,
      },
      datesSet: this.handleDateSet.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this),
    };
  });
  calendarEvents = this.#fullCalendarStore.calendarEvents;
  @ViewChild('calendar') calendar: FullCalendarComponent;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    // Disabled polling for now
    // this.schedulePolling().subscribe();
  }

  ngAfterContentInit(): void {
    setTimeout(() => {
      this.navigateCurrentTime();
    }, 400);
  }

  private schedulePolling(): Observable<number> {
    return interval(120000).pipe(
      takeUntilDestroyed(this.#destroyRef),
      filter(() => this.isBusinessTime()),
      tap(() => {
        this.#fullCalendarStore.schedulePolling();
      })
    );
  }

  private isBusinessTime() {
    const currentTime = dayjs();
    const currentDay = dayjs(this.currentDate).format('dddd');

    return !!this.businessHours().find((business) => {
      if (business.day !== currentDay) {
        return false;
      }

      const firstPeriodStart = dayjs(business.firstPeriodStart, 'HH:mm:ss');
      const firstPeriodEnd = dayjs(business.firstPeriodEnd, 'HH:mm:ss');
      const secondPeriodStart = dayjs(business?.secondPeriodStart, 'HH:mm:ss');
      const secondPeriodEnd = dayjs(business?.secondPeriodEnd, 'HH:mm:ss');

      const isInFirstPeriod = currentTime.isBetween(
        firstPeriodStart,
        firstPeriodEnd,
        'minute',
        '[)'
      );
      const isInSecondPeriod = currentTime.isBetween(
        secondPeriodStart,
        secondPeriodEnd,
        'minute',
        '[)'
      );

      return isInFirstPeriod || isInSecondPeriod;
    });
  }

  businessHourListSetup(): BusinessHoursInput[] {
    const firstPeriodHourToEvent: BusinessHoursInput[] =
      this.businessHours().map((businessHour) => ({
        daysOfWeek: [WeekDayToNumber[businessHour.day]],
        startTime: businessHour.firstPeriodStart,
        endTime: businessHour.firstPeriodEnd,
      }));

    const onlySecondPeriods = this.businessHours().filter(
      (businessHour) =>
        businessHour.secondPeriodStart && businessHour.secondPeriodEnd
    );

    const secondPeriodHourToEvent = onlySecondPeriods.map((businessHour) => ({
      daysOfWeek: [WeekDayToNumber[businessHour.day]],
      startTime: businessHour.secondPeriodStart,
      endTime: businessHour.secondPeriodEnd,
    }));

    return [...firstPeriodHourToEvent, ...secondPeriodHourToEvent];
  }

  handleDateSet(event: DatesSetArg): void {
    this.currentDate = event.startStr;
    this.#fullCalendarStore.getScheduleOnDateChange({
      date: event.startStr,
      _professionalId: this.professional().documentId,
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (clickInfo.event.extendedProps?.['appointment']) {
      this.#openDetailedAppointmentDialog(
        clickInfo.event.extendedProps['appointment'].documentId
      );
    }

    if (clickInfo.event.extendedProps?.['blocker']) {
      this.#openEditBlockerDialog(
        clickInfo.event.extendedProps['blocker'].documentId
      );
    }
  }
  handleEvents() {
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  navigateCurrentTime(): void {
    const currentTime = dayjs().format('HH:mm:ss.sss');
    this.calendar?.getApi().scrollToTime(currentTime);
  }

  openDatePickerDialog(): void {
    const dialogRef = this.#dialog.open(DatePickerDialogComponent, {
      width: '350px',
      data: { date: this.currentDate },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((value) => {
        if (value) {
          this.calendar?.getApi()?.gotoDate(value);
        }
      });
  }

  reloadEventList(date: dayjs.Dayjs): void {
    this.calendar?.getApi()?.gotoDate(date.format('YYYY-MM-DD'));
    this.calendar?.getApi().scrollToTime(date.format('HH:mm:ss.sss'));
  }

  #openEditBlockerDialog(blockerId: string): void {
    const dialogRef = this.#dialog.open<
      AddNewBlockerDialogComponent,
      IBlockerDialogData,
      dayjs.Dayjs
    >(AddNewBlockerDialogComponent, {
      panelClass: ['s-large-dialog'],
      injector: this.#injector,
      data: {
        blockerId: blockerId,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        first(),
        tap((date) => {
          if (date) {
            this.reloadEventList(date);
          }
        })
      )
      .subscribe();
  }

  #openDetailedAppointmentDialog(appointmentId: string): void {
    const dialogRef = this.#dialog.open<
      AppointmentDetailedDialogComponent,
      IAppointmentDetailedDialogData,
      IDetailedAppointmentDialogResp
    >(AppointmentDetailedDialogComponent, {
      injector: this.#injector,
      panelClass: ['s-large-dialog'],
      data: {
        appointmentId: appointmentId,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        switchMap((resp) => {
          if (resp?.view === IDetailedView.EDIT) {
            return this.#openEditAppointmentDialog(resp.appointment!);
          }

          if (resp?.view === IDetailedView.CANCEL) {
            this.reloadEventList(resp.date!);
          }

          return of(null);
        })
      )
      .subscribe();
  }

  #openEditAppointmentDialog(
    appointment: IBarberAppoitmentId
  ): Observable<dayjs.Dayjs | undefined> {
    const dialogRef = this.#dialog.open<
      AddNewAppointmentDialogComponent,
      INewAppointmentDialogData,
      dayjs.Dayjs
    >(AddNewAppointmentDialogComponent, {
      injector: this.#injector,
      panelClass: ['s-large-dialog'],
      data: {
        appointment: appointment,
      },
    });

    return dialogRef.afterClosed().pipe(
      tap((date) => {
        if (date) {
          this.reloadEventList(date);
        }
      })
    );
  }
}
