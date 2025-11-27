import {
  IPaginationParams,
  ILogo,
  InputPhone,
  IAddress,
  IEntityCollection,
} from 'ba-ngrx-signal-based';

export interface IBarbershopListResponse
  extends IEntityCollection<IBarbershopSearch, 'barbershops'> {}

export interface IBarbershopSearch {
  address: IAddress;
  name: string;
  logo: ILogo | null;
  slug: string;
  telephone: Pick<InputPhone, 'internationalNumber'>;
}

export interface IBarbershopVariables {
  name?: string;
  pagination?: IPaginationParams;
}
