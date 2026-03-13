import { IServiceComissions } from './barber-comissions.model';

export interface IBarberComissionsStore {
  services: IServiceComissions[];
  salary: number;
  recurrency: string;
}
