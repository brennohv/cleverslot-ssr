import { DeepSignal } from '@ngrx/signals';
import { IBarberProfile } from './barber-appointment.model';

export interface IUploadFileDialogData {
  barber: DeepSignal<IBarberProfile>;
}
