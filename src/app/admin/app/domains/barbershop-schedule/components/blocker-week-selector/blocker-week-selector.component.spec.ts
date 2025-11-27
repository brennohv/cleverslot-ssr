import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BlockerWeekSelectorComponent } from './blocker-week-selector.component';
import {
  DayOfWeekEnum,
  IScheduleBlockerDay,
} from '@admin/barbershop-schedule/data/types';

describe('WeeklyCalendarComponent', () => {
  let component: BlockerWeekSelectorComponent;
  let fixture: ComponentFixture<BlockerWeekSelectorComponent>;
  const days: IScheduleBlockerDay[] = [
    {
      dayOfWeek: DayOfWeekEnum.MONDAY,
      abbreviation: 'Seg',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.TUESDAY,
      abbreviation: 'Ter',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.WEDNESDAY,
      abbreviation: 'Qua',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.THURSDAY,
      abbreviation: 'Qui',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.FRIDAY,
      abbreviation: 'Sex',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.SATURDAY,
      abbreviation: 'Sab',
      selected: true,
    },
    {
      dayOfWeek: DayOfWeekEnum.SUNDAY,
      abbreviation: 'Dom',
      selected: true,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [BlockerWeekSelectorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockerWeekSelectorComponent);
    component = fixture.componentInstance;
    component.defaultDays = days;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change selected', () => {
    component.changeSelection(component.defaultDays[1]);
    expect(component.defaultDays[1].selected).toBeFalsy();
  });
});
