import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BarbershopConfigPaymentsStore } from '@admin/barbershop-config/data/stores';
import {
  IBarbershopPaymentDTO,
  IConfirmDeleteModalData,
} from '@admin/barbershop-config/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { SpinnerComponent } from 'ba-ngrx-signal-based';
import { first, map } from 'rxjs';
import {
  AddNewPaymentModalComponent,
  BarbershopConfigCardComponent,
  ConfirmDeleteModalComponent,
  BarbershopConfigHeaderComponent,
} from '@admin/barbershop-config/components';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-barbershop-config-payments',
  standalone: true,
  providers: [BarbershopConfigPaymentsStore],
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    SpinnerComponent,
    MatListModule,
    MatIcon,
    MatButtonModule,
    BarbershopConfigCardComponent,
    BarbershopConfigHeaderComponent,
  ],
  templateUrl: './barbershop-config-payments.component.html',
  styleUrl: './barbershop-config-payments.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigPaymentsComponent {
  #barbershopConfigPaymentsStore = inject(BarbershopConfigPaymentsStore);
  #breakPointObserver = inject(BreakpointObserver);
  paymentList = this.#barbershopConfigPaymentsStore.paymentMethods;
  isLoading = this.#barbershopConfigPaymentsStore.loading;
  isMobile = toSignal(
    this.#breakPointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches))
  );
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.config-payments.';

  constructor(public dialog: MatDialog) {}

  openCreateEditPaymentDialog(payment?: IBarbershopPaymentDTO): void {
    const dialogRef = this.dialog.open<
      AddNewPaymentModalComponent,
      IBarbershopPaymentDTO,
      IBarbershopPaymentDTO | null
    >(AddNewPaymentModalComponent, {
      panelClass: ['s-large-dialog'],
      ...(payment && {
        data: {
          value: payment.value,
          id: payment?.id,
        },
      }),
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((resp) => {
        if (resp) {
          this.#barbershopConfigPaymentsStore.updateCreatePaymentSetup({
            ...resp,
          });
        }
      });
  }

  deletePaymentDialog(payment?: IBarbershopPaymentDTO): void {
    const dialogRef = this.dialog.open<
      ConfirmDeleteModalComponent,
      IConfirmDeleteModalData,
      string | null
    >(ConfirmDeleteModalComponent, {
      panelClass: ['s-large-dialog'],
      data: {
        title: this.I18N_PREFFIX + 'confirm-delete-title',
        description: this.I18N_PREFFIX + 'confirm-delete-description',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((resp) => {
        if (resp === 'Yes') {
          this.#barbershopConfigPaymentsStore.deletePaymentSetup(payment!.id!);
        }
      });
  }
}
