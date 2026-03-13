export interface ICreateScheduleBlockerResponse {
  createScheduleBlocker: {
    documentId: string;
  };
}

export interface ICreateScheduleBlockerParams {
  barber: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  daysOfWeek: DayOfWeek[];
}

export interface DayOfWeek {
  dayOfWeek: DayOfWeekEnum;
}

export enum DayOfWeekEnum {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface ICreateScheduleBlockerVariables {
  data: ICreateScheduleBlockerParams;
}

export interface IScheduleBlockerDay {
  dayOfWeek: DayOfWeekEnum;
  abbreviation?: string;
  selected?: boolean;
}
