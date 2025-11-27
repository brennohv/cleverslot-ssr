import {
  IBarbershopBarber,
  IServiceComissions,
} from './barbershop-config-comissions.model';

export interface IBarbershopComissionsStore {
  services: IServiceComissions[];
  salary: number;
  recurrency: string;
  professionalList: IBarbershopBarber[];
}
