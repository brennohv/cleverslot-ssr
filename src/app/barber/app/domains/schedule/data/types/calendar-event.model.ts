import { EventInput } from '@fullcalendar/core';
import { IBarberAppointment } from './barber-appointment.model';
import { IBarberBlockers } from './barber-blocker.model';

export interface IScheduleEvent extends EventInput {
  extendedProps: {
    blocker?: IBarberBlockers;
    appointment?: IBarberAppointment;
  };
}
