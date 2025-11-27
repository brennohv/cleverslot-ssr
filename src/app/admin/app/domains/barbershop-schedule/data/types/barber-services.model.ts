import { ILogo } from 'ba-ngrx-signal-based';

export interface IBarberServiceListResponse {
  services?: IBarberService[];
}

export interface IBarberService {
  documentId: string;
  name: string;
  recurrency: string;
  value: number;
  duration: number;
  photo?: ILogo;
}

export interface IBarberServiceListVariables {
  barbershopId: string;
  barberId: string;
}
