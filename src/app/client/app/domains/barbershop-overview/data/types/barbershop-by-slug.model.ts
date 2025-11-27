import { InputPhone, IAddress, ILogo } from 'ba-ngrx-signal-based';

export interface IBarbershopBySlugListResponse {
  barbershops?: IBarbershopBySlug[];
}
export interface IBarbershopOverviewStore {
  barbershop: IBarbershopBySlug;
}
export interface IBarbershopBySlug {
  documentId: string;
  name: string;
  slug: string;
  establishment: IEstablishment[];
  paymentMethods: IPaymentMethods[];
  address: IAddress;
  images: ILogo[];
  logo: ILogo | null;
  telephone: Pick<InputPhone, 'internationalNumber'> | null;
}

export interface IEstablishment {
  day: string;
  firstPeriodStart: string;
  firstPeriodEnd: string;
  secondPeriodStart: null | string;
  secondPeriodEnd: null | string;
}

export interface IPaymentMethods {
  value: string;
}

export interface IBarber {
  lastName: null;
  firstName: null;
  photo: ILogo;
}

export interface IBarbershopBySlugVariables {
  slug: string;
}
