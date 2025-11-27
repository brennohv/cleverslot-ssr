export interface IBusinessHourResponse {
  barbershops: IBarbershopBarber[];
}

export interface IBarbershopBarber {
  establishment: IBusinessHour[];
}

export interface IBusinessHour {
  day: string;
  firstPeriodStart: string;
  firstPeriodEnd: string;
  secondPeriodStart: null | string;
  secondPeriodEnd: null | string;
}

export interface IBusinessHourVariables {
  slug: string;
}
