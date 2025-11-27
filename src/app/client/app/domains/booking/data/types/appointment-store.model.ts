import { IAppointment } from './appointment-list';

export interface IAppointmentListStore {
  appointments: IAppointment[];
  filter: {
    startDate: Date;
    endDate?: Date;
    page: number;
  };
}
