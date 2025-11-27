import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DayOfWeekEnum,
  IScheduleBlockerDay,
} from '@admin/barbershop-schedule/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-blocker-week-selector',
  templateUrl: './blocker-week-selector.component.html',
  styleUrls: ['./blocker-week-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslocoPipe,
    TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockerWeekSelectorComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-schedule.blocker-week.';
  defaultDays: IScheduleBlockerDay[] = [
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
  ];
  days = input<IScheduleBlockerDay[]>(this.defaultDays);
  selectedDaysChange = output<IScheduleBlockerDay[]>();

  changeSelection(day: IScheduleBlockerDay): void {
    day.selected = !day.selected;
    this.selectedDaysChange.emit(this.days());
  }

  ngOnInit(): void {
    this.selectedDaysChange.emit(this.days());
  }
}
