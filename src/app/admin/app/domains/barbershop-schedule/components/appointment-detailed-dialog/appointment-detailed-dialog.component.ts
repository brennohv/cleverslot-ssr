import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { NewAppointmentBarberStore } from '@admin/barbershop-schedule/data/stores';
import {
  IAppointmentDetailedDialogData,
  IBarberAppoitmentId,
  IDetailedAppointmentDialogResp,
  IDetailedView,
} from '@admin/barbershop-schedule/data/types';
import {
  GetImgUrlPipe,
  IStatus,
  ModalBodyComponent,
} from 'ba-ngrx-signal-based';
import { first } from 'rxjs';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {
  DateDescriptionRxPipe,
  TimeFormatPipe,
} from '@admin/barbershop-schedule/utils';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

enum ContentView {
  DEFAULT = 'DEFAULT',
  CANCEL_APPOINTMENT = 'CANCEL_APPOINTMENT',
}

@Component({
  selector: 'app-appointment-detailed-dialog',
  standalone: true,
  imports: [
    ModalBodyComponent,
    TranslocoPipe,
    TranslocoDirective,
    NgxSkeletonLoaderModule,
    GetImgUrlPipe,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    TimeFormatPipe,
    DateDescriptionRxPipe,
    AsyncPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './appointment-detailed-dialog.component.html',
  styleUrl: './appointment-detailed-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentDetailedDialogComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-schedule.appointment-detailed.';
  readonly IDetailedView = IDetailedView;
  readonly ContentView = ContentView;
  readonly IAppointmentStatus = IStatus;

  #newAppointmentBarberStore = inject(NewAppointmentBarberStore);
  isLoaded = this.#newAppointmentBarberStore.loaded;
  appointmentById = signal<IBarberAppoitmentId | null>(null);
  contentView = signal<ContentView>(ContentView.DEFAULT);
  canEdit = signal<boolean>(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IAppointmentDetailedDialogData,
    public dialogRef: MatDialogRef<AppointmentDetailedDialogComponent>
  ) {}

  ngOnInit(): void {
    this.getDataFromInjection();
  }

  private getDataFromInjection(): void {
    const { appointmentId } = this.data;

    if (appointmentId) {
      this.getAppointmentById(appointmentId);
    }
  }

  private getAppointmentById(appointmentId: string): void {
    this.#newAppointmentBarberStore
      .getAppointmentById(appointmentId)
      .pipe(first())
      .subscribe({
        next: (resp) => {
          if (!resp.data) {
            return;
          }

          this.#newAppointmentBarberStore.setSeletedSlot({
            date: resp.data.appointment.date,
            endTime: dayjs(resp.data.appointment.endTime, 'HH:mm:ss').format(
              'HH:mm'
            ),
            startTime: dayjs(
              resp.data.appointment.startTime,
              'HH:mm:ss'
            ).format('HH:mm'),
          });
          this.appointmentById.update(() => resp.data!.appointment);
          this.canEdit.update(() => {
            const appointmentDate = dayjs(this.appointmentById()?.date);
            const isNotPastDay = appointmentDate.isSameOrAfter(
              dayjs().startOf('day')
            );
            const isNotCanceled =
              this.appointmentById()?.appointmentStatus === IStatus.BOOKED;
            return isNotPastDay && isNotCanceled;
          });
        },
      });
  }

  close(resp?: IDetailedAppointmentDialogResp): void {
    this.dialogRef.close(resp ?? null);
  }

  changeContentView(view: ContentView): void {
    this.contentView.update(() => view);
  }

  cancelAppointment(): void {
    this.#newAppointmentBarberStore.cancelAppointment(this.dialogRef);
  }
}
