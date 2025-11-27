import { IStatus } from 'ba-ngrx-signal-based';
import { IBarberAppointmentNonRegisteredUser } from './barber-appointment.model';
import { IClientsFromBarbershop } from './clients-from-barbershop.model';
import { IBarberService } from './barber-services.model';

export interface IBarberAppoitmentIdResponse {
  appointment: IBarberAppoitmentId;
}

export interface IBarberAppoitmentId {
  documentId: string;
  date: string;
  startTime: string;
  endTime: string;
  client?: IClientsFromBarbershop;
  nonRegisteredUser?: IBarberAppointmentNonRegisteredUser;
  appointmentStatus: IStatus;
  service: Omit<IBarberService, 'duration' | 'photo'>;
}

export interface IBarberAppoitmentIdVariables {
  appointmentId: string;
}
