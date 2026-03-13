import { IBarberProfile } from './barber-appointment.model';
import { MatDialogRef } from '@angular/material/dialog';

export type IBarberConfigStore = {
  barber: IBarberProfile;
};

export interface IBarberUploadRx {
  file: File;
  matDialogRef: MatDialogRef<unknown>;
  photoId?: string | null;
}
