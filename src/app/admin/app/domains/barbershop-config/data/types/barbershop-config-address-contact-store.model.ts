import {
  IBarbershopAddressDTO,
  IBarbershopContactDTO,
} from './barbershop-config-address-contact.model';

export interface IBarbershopAddressContactStore {
  address: IBarbershopAddressDTO | null;
  telephone: IBarbershopContactDTO | null;
}
