import { IProfessional } from '@admin/shared/data/types';
import { IBusinessHour } from './business_hour.model';

export type IBarbershopScheduleStore = {
  professionalList: IProfessional[];
  businessHours: IBusinessHour[];
};

export type IBarbershopScheduleStoreFilter = {
  date: Date;
};
