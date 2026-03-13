export interface IBarberProfileResponse {
  barber: IBarberProfile;
}

export interface IBarberProfile {
  documentId: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null | undefined;
  photoId: string | null | undefined;
  services: IServiceId[];
}

export interface IServiceId {
  documentId: string;
}

export interface IBarberAppointmenVariables {
  barberId: string;
}
