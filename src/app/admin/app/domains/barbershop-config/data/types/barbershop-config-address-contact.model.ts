import { InputPhone } from 'ba-ngrx-signal-based';

export type IGetAddressContactResponse = {
  barbershop: {
    address: IBarbershopAddressDTO;
    telephone: IBarbershopContactDTO;
  };
};

export interface IBarbershopAddressDTO {
  street: string;
  number: number;
  complement?: string;
  postalCode: string;
  country?: string;
  city?: string;
  id?: string;
}

export interface IBarbershopContactDTO extends InputPhone {
  id?: string;
}

/**** UPDATE ****/

export type IUpdateAddressResponse = {
  updateBarbershop: {
    address: IBarbershopAddressDTO;
  };
};

export type IUpdateContactResponse = {
  updateBarbershop: {
    telephone: IBarbershopContactDTO;
  };
};

export interface IUpdateAddressVariables {
  documentId: string;
  data: {
    address: IBarbershopAddressDTO;
  };
}

export interface IUpdateContactVariables {
  documentId: string;
  data: {
    telephone: IBarbershopContactDTO;
  };
}

export interface IGetAddressContactVariables {
  documentId: string;
}
