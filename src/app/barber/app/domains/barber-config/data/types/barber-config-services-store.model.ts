import { ILogo } from 'ba-ngrx-signal-based';

export type IBarberConfigServicesStore = {
  services: IBarberConfigServiceList[];
  serviceFilter: string;
};

export type IBarberConfigServiceList = {
  name: string;
  photo: ILogo;
  professionalPercentage: number;
  documentId: string;
  checked: boolean;
  duration: number;
  value: string;
};
