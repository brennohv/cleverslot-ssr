import { IBusinessHourDTO } from './barbershop-config-business-hours.model';

export interface IBarbershopBusinessHoursStore {
  businessHours: IBusinessHourStore[] | [];
}

export interface IBusinessHourStore extends IBusinessHourDTO {
  active: boolean;
  secondPeriodActive: boolean;
}

export type PossibleBusinessHourEntries = Exclude<
  keyof IBusinessHourDTO,
  'day'
>;

export interface onChangeBusinessHourParams {
  value: string;
  day: string;
  entry: PossibleBusinessHourEntries;
}
