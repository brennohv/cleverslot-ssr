import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-cancel-appointment-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './cancel-appointment-modal.component.html',
  styleUrl: './cancel-appointment-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelAppointmentModalComponent {
  readonly I18N_PREFFIX = 'mfClient.my-booking.cancel-modal.';

  constructor(
    public dialogRef: MatDialogRef<CancelAppointmentModalComponent>
  ) {}
}
