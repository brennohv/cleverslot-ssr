import { IBarbershopServiceDTO } from './barbershop-config-service.model';

export type ICreateServiceResponse = {
  createService: IBarbershopServiceDTO;
};

export interface ICreateServiceVariables {
  data: {
    isActive: boolean;
    duration: number;
    name: string;
    recurrency: string;
    value: number;
    professionalPercentage: number;
    barbershop: string;
    barbers: string[];
    photo?: string;
  };
}

export interface ICreateServiceParams {
  barbershopDocId: string;
  duration: number;
  name: string;
  recurrency: string;
  value: number;
  professionalPercentage: number;
  fileId?: string;
  barbers: string[];
}
