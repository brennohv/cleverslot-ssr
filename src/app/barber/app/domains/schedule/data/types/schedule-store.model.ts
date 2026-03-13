import { EventInput } from '@fullcalendar/core';
import { IBarberAppointment } from './barber-appointment.model';
import { IBarberBlockers } from './barber-blocker.model';
import { IBusinessHour } from './business_hour.model';

export type IScheduleStore = {
  filter: IScheduleStoreFilter;
  calendarEvents: ICalendarEvents[];
  businessHours: IBusinessHour[];
};

export type IScheduleStoreFilter = {
  date: Date;
};

export interface ICalendarEvents extends EventInput {
  blocker?: IBarberBlockers;
  appointment?: IBarberAppointment;
}