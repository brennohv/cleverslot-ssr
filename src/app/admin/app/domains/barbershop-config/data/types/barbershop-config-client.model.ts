import { MatDialogRef } from '@angular/material/dialog';
import {
  IEntityCollection,
  ILogo,
  InputPhone,
  IPaginationParams,
} from 'ba-ngrx-signal-based';

export type IClientListResponse = IEntityCollection<
  IClientsFromBarbershop,
  'usersPermissionsUsers'
>;

export interface IClientsFromBarbershop {
  username: string;
  email: string;
  documentId: string;
  photo: ILogo | null;
  telephone: Pick<InputPhone, 'internationalNumber'>;
}

export interface IClientListVariables {
  barbershopId: string;
  identifier?: string;
  pagination?: IPaginationParams;
}

export interface IClientListStore {
  clients: IClientsFromBarbershop[];
  identifier: string;
}

export interface IAddNewClientParams {
  dialogRef: MatDialogRef<unknown>;
  email: string;
  password: string;
  telephone: InputPhone;
  username: string;
}
