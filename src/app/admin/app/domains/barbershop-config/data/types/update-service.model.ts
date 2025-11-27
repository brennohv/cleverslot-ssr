import { IBarbershopServiceDTO } from './barbershop-config-service.model';

export type IUpdateServiceResponse = {
  updateService: IBarbershopServiceDTO;
};

export interface IUpdateServiceVariables {
  documentId: string;
  data: {
    isActive: boolean;
    duration: number;
    name: string;
    recurrency: string;
    value: number;
    professionalPercentage: number;
    photo?: string;
    barbers: string[];
  };
}
export interface IUpdateServiceParams {
  isActive: boolean;
  documentId: string;
  duration: number;
  name: string;
  recurrency: string;
  value: number;
  professionalPercentage: number;
  fileId?: string;
  barbers: string[];
}
