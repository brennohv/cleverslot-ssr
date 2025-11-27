import {
  IEntityCollection,
  ILogo,
  IPaginationParams,
  IStatus,
} from 'ba-ngrx-signal-based';

export type IAppointmentsResponse = IEntityCollection<
  IAppointment,
  'appointments'
>;

export interface IAppointment {
  date: string;
  startTime: string;
  endTime: string;
  documentId: string;
  appointmentStatus: IStatus;
  barbershop: IBarbershopAppointment;
  service: IServiceAppointment;
}

export interface IServiceAppointment {
  id: string;
  name: string;
  recurrency: string;
  value: number;
}

export interface IBarbershopAppointment {
  id: string;
  name: string;
  logo: ILogo | null;
  slug: string;
}

export interface IAppointmentBarbershop {
  id: string;
  name: string;
  logo: ILogo | null;
}

export interface IAppointmentsParams {
  sort?: string[];
  userId: string;
  startDate: string;
  endDate?: string;
  pagination?: IPaginationParams;
}
