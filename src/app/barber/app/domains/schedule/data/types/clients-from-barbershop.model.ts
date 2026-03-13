import { ILogo, InputPhone } from 'ba-ngrx-signal-based';

export interface IBarbershopClientsResponse {
  barbershop: IClientsFromBarbershopResponse;
}
export interface IClientsFromBarbershopResponse {
  clients: IClientsFromBarbershop[];
}

export interface IClientsFromBarbershop {
  username: string;
  email: string;
  documentId: string;
  photo: ILogo | null;
  telephone: Pick<InputPhone, 'internationalNumber'>;
}

export interface IClientsFromBarbershopVariables {
  barbershopId: string;
  identifier?: string;
}
