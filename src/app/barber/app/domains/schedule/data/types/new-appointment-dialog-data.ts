import { IBarberAppoitmentId } from './appointment-by-id.model';
import { INewEventDialogData } from './new-event-dialog.model';

export interface INewAppointmentDialogData extends INewEventDialogData {
  appointment?: IBarberAppoitmentId;
}
