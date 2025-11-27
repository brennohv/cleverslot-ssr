import { ILogo } from 'ba-ngrx-signal-based';
import { IBrandImage } from './barbershop-config-brand.model';

export type IBarbershopBrandStore = {
  name: string;
  logo: ILogo | null;
  images: IBrandImage[];
  slug: string;
};
