import dayjs from 'dayjs';
import { IBarberAppoitmentId } from './appointment-by-id.model';

export enum IDetailedView {
  EDIT = 'EDIT',
  CANCEL = 'CANCEL',
  CLOSE = 'CLOSE',
}

export interface IDetailedAppointmentDialogResp {
  date?: dayjs.Dayjs;
  view: IDetailedView;
  appointment?: IBarberAppoitmentId;
}
