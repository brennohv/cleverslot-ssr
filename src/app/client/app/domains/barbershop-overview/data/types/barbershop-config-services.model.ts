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
  photo: ILogo | null;
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

export type IBarbershopServiceStore = {
  services: IBarbershopServiceDTO[];
  serviceFilter: string;
  barbershopDocId: string;
};
