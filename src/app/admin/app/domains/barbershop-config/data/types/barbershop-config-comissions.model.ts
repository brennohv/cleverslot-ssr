import { ILogo } from 'ba-ngrx-signal-based';

export interface IBarbershopComissionsResponse {
  comissionsByProfessional: IBarbershopComissions;
}

export interface IBarbershopComissions {
  salary: number;
  services: IServiceComissions[];
}

export interface IServiceComissions {
  name: string;
  quantity: string;
  totalValue: number;
  photoUrl: string | null;
  recurrency: string;
  appointments: IServiceAppointments[];
}
export interface IServiceAppointments {
  startTime: string;
  date: string;
  client: IServiceClient | null;
  nonRegisteredUser: IServiceNonRegisteredUser | null;
}

export interface IServiceClient {
  username: string;
}

export interface IServiceNonRegisteredUser {
  name: string;
}

export interface IBarbershopComissionsParams {
  barberId: string;
  barbershopId: string;
  dateStart: string;
  dateEnd: string;
}

export interface IBarbershopComissionsVariables {
  data: IBarbershopComissionsParams;
}

export interface IGetBarberListResponse {
  barbers: IBarbershopBarber[];
}

export interface IBarbershopBarber {
  documentId: string;
  firstName: string;
  lastName: string;
  userBarber: {
    photo: ILogo | null;
  };
}

export interface IBarberListVariables {
  barbershopId: string;
}
