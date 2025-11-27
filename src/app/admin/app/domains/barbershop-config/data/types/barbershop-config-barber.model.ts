import { MatDialogRef } from '@angular/material/dialog';
import { InputPhone } from 'ba-ngrx-signal-based';

import {
  IEntityCollection,
  ILogo,
  IPaginationParams,
} from 'ba-ngrx-signal-based';
import { BarbershopPlan } from './barbershop-subscription-plan.model';

export type IBarberCollectionResponse = IEntityCollection<
  IBarbershopBarberDTO,
  'barbers'
>;

export interface IGetBarbershopBarberVariables {
  barbershopId: string;
  pagination?: IPaginationParams;
}

export interface IBarbershopBarberDTO {
  documentId: string;
  firstName: string;
  lastName: string;
  userBarber: {
    photo: ILogo;
    email: string;
  };
}

export type ICreateBarberResponse = {
  createBarber: {
    documentId: string;
    firstName: string;
    lastName: string;
    userBarber: {
      photo: ILogo;
      email: string;
    };
  };
};

export interface ICreateBarberVariables {
  data: {
    firstName: string;
    lastName: string;
    barbershop: string;
    userBarber: string;
  };
}
export type IDeleteBarberResponse = {
  deleteBarber: {
    documentId: string;
  };
};

export interface IDeleteBarberVariables {
  documentId: string;
}

export interface IBarbershopConfigBarberStore {
  barbers: IBarbershopBarberDTO[];
  userAsProfessionalView: boolean;
  barbershopSubscriptionPlan: BarbershopPlan | null;
}

export interface IAddNewEmployeeParams {
  dialogRef: MatDialogRef<unknown>;
  photo: File | null;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  telephone: InputPhone;
  username: string;
}
