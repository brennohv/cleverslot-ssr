import { IFreeSlot } from 'ba-ngrx-signal-based';
import { IBarberFreeSlots } from './get-barbers';

export interface IFreeSlotsStore {
  selectedSlot: IFreeSlot;
  freeSlotsList: IFreeSlot[];
  professionalList: IBarberFreeSlots[];
  barbershopId: string;
  serviceId: string;
  selectedBarberId: string | null | undefined;
  date: Date | null | undefined;
  nextAvailabilitySearch: boolean;
  weekSlotList: {
    total: number;
    date: string;
    slots: IFreeSlot[];
  }[];
}
