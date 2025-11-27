import { ILogo } from 'ba-ngrx-signal-based';
import { IProfessional } from '@admin/shared/data/types';

export type IBarbershopConfigServicesStore = {
  services: IBarbershopConfigService[];
  allProfessionals: IProfessional[];
  serviceFilter: string;
};

export type IBarbershopConfigService = {
  name: string;
  photo?: ILogo;
  professionalPercentage: number;
  documentId: string;
  duration: number;
  isActive: boolean;
  value: number;
  _value?: string;
  lucro?: string;
  recurrency: string;
  barbers: IProfessional[];
};

export interface IUpdateServiceSetupParams {
  name: string;
  value: number;
  duration: number;
  professionalPercentage: number;
  recurrency: string;
  photo: File | null;
  documentId: string;
  isActive: boolean;
  barbers: IProfessional[];
}
