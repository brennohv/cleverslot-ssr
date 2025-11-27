import { INewEventDialogData } from './new-event-dialog.model';

export interface IAppointmentDetailedDialogData extends INewEventDialogData {
  appointmentId: string;
}
