import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IScheduleEvent } from '@admin/barbershop-schedule/data/types';
import { TimeFormatPipe } from '@admin/barbershop-schedule/utils';
import { GetImgUrlPipe } from 'ba-ngrx-signal-based';

@Component({
  selector: 'app-calendar-event',
  standalone: true,
  imports: [TimeFormatPipe, GetImgUrlPipe],
  templateUrl: './calendar-event.component.html',
  styleUrl: './calendar-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarEventComponent {
  calendarEvent = input<IScheduleEvent>();
}
