import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import { IAppointment } from '../../data/types';

@Pipe({
  name: 'isPastDate',
  standalone: true,
})
export class IsPastDatePipe implements PipeTransform {
  transform(appointment: IAppointment): boolean {
    const appointmentMoment = dayjs(
      `${appointment.date} ${appointment.startTime}`
    );
    const now = dayjs();

    return appointmentMoment.isBefore(now);
  }
}
