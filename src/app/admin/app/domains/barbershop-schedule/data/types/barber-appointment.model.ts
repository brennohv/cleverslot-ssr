import { ILogo, IStatus, InputPhone } from 'ba-ngrx-signal-based';

export interface IBarberAppointmentsResponse {
  appointments: IBarberAppointment[];
}

export interface IBarberAppointment {
  documentId: string;
  date: string;
  startTime: string;
  endTime: string;
  client?: IBarberAppointmentClient;
  nonRegisteredUser?: IBarberAppointmentNonRegisteredUser;
  appointmentStatus: IStatus;
  service: {
    name: string;
  };
}

export interface IBarberAppointmentClient {
  username: string;
  telephone: Pick<InputPhone, 'internationalNumber'>;
  photo: ILogo | null;
}
export interface IBarberAppointmentNonRegisteredUser {
  name: string;
  telephone: Pick<InputPhone, 'internationalNumber'>;
}

export interface IBarberAppointmenVariables {
  barberId: string;
  date: string;
}
