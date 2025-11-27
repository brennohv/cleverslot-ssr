import { DayOfWeek } from './barber-create-schedule-blocker.model';

export interface IBarberBlockerIdResponse {
  scheduleBlocker: IBarberBlockerId;
}

export interface IBarberBlockerId {
  documentId: string;
  endDate: string;
  endTime: string;
  startDate: string;
  startTime: string;
  daysOfWeek: DayOfWeek[];
}

export interface IBarberBlockerIdVariables {
  blockerId: string;
}
