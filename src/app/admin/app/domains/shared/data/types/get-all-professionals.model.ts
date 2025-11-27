import { ILogo } from 'ba-ngrx-signal-based';

export interface IProfessionalListResponse {
  barbers: IProfessional[];
}

export interface IProfessional {
  documentId: string;
  firstName: string;
  lastName: string;
  userBarber: {
    photo: ILogo | null;
  };
}

export interface IProfessionalListVariables {
  barbershopId: string;
}
