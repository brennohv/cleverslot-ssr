import { ILogo } from 'ba-ngrx-signal-based';

export interface IBarberListFreeSlotsResponse {
  barbers: IBarberFreeSlots[];
}

export interface IBarberFreeSlots {
  documentId: string;
  firstName: string;
  lastName: string;
  userBarber: {
    photo: ILogo | null;
  };
}

export interface IBarberListFreeSlotsVariables {
  serviceId: string;
  barbershopId: string;
}
