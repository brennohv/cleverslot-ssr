import {
  Component,
  computed,
  inject,
  Injector,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AddNewAppointmentDialogComponent } from '../add-new-appointment-dialog/add-new-appointment-dialog.component';
import { AddNewBlockerDialogComponent } from '../add-new-blocker-dialog/add-new-blocker-dialog.component';
import { first, map, tap } from 'rxjs';
import { INewEventDialogData } from '@barber/schedule/data/types';
import dayjs from 'dayjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { NewAppointmentBarberStore } from '@barber/schedule/data/stores';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTooltipModule } from '@angular/material/tooltip';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

@Component({
  selector: 'app-feature-add-new-event',
  standalone: true,
  providers: [NewAppointmentBarberStore],
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslocoPipe,
    MatTooltipModule,
  ],
  templateUrl: './feature-add-new-event.component.html',
  styleUrl: './feature-add-new-event.component.scss',
})
export class FeatureAddNewEventComponent {
  readonly I18N_PREFFIX = 'mfBarber.schedule.add-new-event.';
  #dialog = inject(MatDialog);
  #injector = inject(Injector);
  #activatedRoute = inject(ActivatedRoute);
  date = input.required<string>();
  canCreateAppointment = computed(() => {
    const today = dayjs().startOf('day');
    const currentDate = dayjs(this.date());
    return today.isSameOrBefore(currentDate);
  });
  reloadCalendarEvents = output<dayjs.Dayjs>();
  isBarbershopActive = toSignal<boolean>(
    this.#activatedRoute.data.pipe(
      map(({ isBarbershopActive }) => isBarbershopActive),
    ),
  );

  openNewAppointmentDialog(): void {
    if (!this.isBarbershopActive()) {
      return;
    }
    const dialogRef = this.#dialog.open<
      AddNewAppointmentDialogComponent,
      INewEventDialogData,
      dayjs.Dayjs
    >(AddNewAppointmentDialogComponent, {
      injector: this.#injector,
      panelClass: ['s-large-dialog'],
      data: {
        date: dayjs(this.date()),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        first(),
        tap((date) => {
          if (date) {
            this.reloadCalendarEvents.emit(date);
          }
        }),
      )
      .subscribe();
  }

  openNewBlockerDialog(): void {
    if (!this.isBarbershopActive()) {
      return;
    }
    const dialogRef = this.#dialog.open<
      AddNewBlockerDialogComponent,
      INewEventDialogData,
      dayjs.Dayjs
    >(AddNewBlockerDialogComponent, {
      panelClass: ['s-large-dialog'],
      data: {
        date: dayjs(this.date()),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(
        first(),
        tap((date) => {
          if (date) {
            this.reloadCalendarEvents.emit(date);
          }
        }),
      )
      .subscribe();
  }
}
