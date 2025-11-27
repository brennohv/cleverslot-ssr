import {
  IFreeSlot,
  INonRegisteredUser,
  InputPhone,
} from 'ba-ngrx-signal-based';
import { IBarberService } from './barber-services.model';
import { IClientsFromBarbershop } from './clients-from-barbershop.model';
import { IBarberAppoitmentId } from './appointment-by-id.model';

export interface INewBarberAppointmentStore {
  selectedSlot: IFreeSlot;
  serviceList: IBarberService[];
  clientList: IClientsFromBarbershop[];
  freeSlotsList: IFreeSlot[];
  selectedServiceId: string | null | undefined;
  selectedClientId: string | null | undefined;
  date: Date | null | undefined;
  nonRegisteredUser: INonRegisteredUser | null;
  isAccommodationSlotView: boolean;
  appointmentEdit: IBarberAppoitmentId | null;
  clientView: IClientView;
  newClientForm: {
    username: string;
    email: string;
    telephone: null | InputPhone;
  };
}

export enum IClientView {
  NON_REGISTERED = 'NON_REGISTERED',
  REGISTERED = 'REGISTERED',
  NEW_CLIENT = 'NEW_CLIENT',
}
