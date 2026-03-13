export interface IBarberComissionsResponse {
  comissionsByProfessional: IBarberComissions;
}

export interface IBarberComissions {
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

export interface IBarberComissionsParams {
  barberId: string;
  barbershopId: string;
  dateStart: string;
  dateEnd: string;
}

export interface IBarberComissionsVariables {
  data: IBarberComissionsParams;
}
