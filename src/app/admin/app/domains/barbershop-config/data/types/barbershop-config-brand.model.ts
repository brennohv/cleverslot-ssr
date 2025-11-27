import { ILogo } from 'ba-ngrx-signal-based';

export type IGetBrandResponse = {
  barbershop: {
    slug: string;
    name: string;
    logo: ILogo;
    images: IBrandImage[];
  };
};

export interface IBrandImage extends ILogo {
  id: string;
}

export interface IGetBrandVariables {
  documentId: string;
}

export type IUpdateBrandResponse = {
  updateBarbershop: {
    name: string;
    logo: ILogo;
    images: IBrandImage[];
  };
};

export interface IUpdateBrandVariables {
  documentId: string;
  data: {
    name?: string;
    logo?: string;
    images?: string[];
  };
}
