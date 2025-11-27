export type IGetBusinessHoursResponse = {
  barbershop: {
    establishment: IBusinessHourDTO[];
  };
};

export interface IBusinessHourDTO {
  day: string;
  firstPeriodStart: string;
  firstPeriodEnd: string;
  secondPeriodStart: null | string;
  secondPeriodEnd: null | string;
}

export interface IGetBusinessHoursVariables {
  documentId: string;
}

/**** UPDATE ****/

export type IUpdateBusinessHoursResponse = {
  updateBarbershop: {
    establishment: IBusinessHourDTO[];
  };
};

export interface IUpdateBusinessHourVariables {
  documentId: string;
  data: {
    establishment: IBusinessHourDTO[];
  };
}
