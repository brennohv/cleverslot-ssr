import { IBarbershopSearch } from './barbershop-list.model';

export type ISearchBarbershopStore = {
  filter: ISearchBarberShopStoreFilter;
  barbershops: IBarbershopSearch[];
};

export type ISearchBarberShopStoreFilter = {
  name: string;
  page: number;
};
