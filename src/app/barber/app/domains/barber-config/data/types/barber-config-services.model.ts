import {
  IEntityCollection,
  ILogo,
  IPaginationParams,
} from 'ba-ngrx-signal-based';

export type IBarbershopServiceListResponse = IEntityCollection<
  IBarbershopServiceDTO,
  'services'
>;

export interface IBarbershopServiceDTO {
  name: string;
  photo: ILogo;
  documentId: string;
  professionalPercentage: number;
  recurrency: string;
  value: number;
  duration: number;
}

export interface IBarbershopServiceVariables {
  barbershopId: string;
  pagination?: IPaginationParams;
  serviceName?: string;
}
