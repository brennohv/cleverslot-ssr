import { IProfessional } from '@admin/shared/data/types';

export interface INewServiceDialog {
  name: string;
  value: number;
  duration: number;
  professionalPercentage: number;
  recurrency: string;
  photo: File | null;
  barbers: IProfessional[];
}
