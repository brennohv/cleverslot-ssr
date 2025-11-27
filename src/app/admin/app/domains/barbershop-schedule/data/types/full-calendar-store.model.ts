import { EventInput } from '@fullcalendar/core';
import { IBarberBlockers } from './barber-blocker.model';
import { IBarberAppointment } from './barber-appointment.model';

export type IFullCalendarStore = {
  filter: IFullCalendarStoreFilter;
  professionalId: string;
  calendarEvents: ICalendarEvents[];
};

export type IFullCalendarStoreFilter = {
  date: Date;
};

export interface ICalendarEvents extends EventInput {
  blocker?: IBarberBlockers;
  appointment?: IBarberAppointment;
}