import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslocoDirective } from '@jsverse/transloco';
import { GetImgUrlPipe, SpinnerComponent } from 'ba-ngrx-signal-based';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  AddNewBarberModalComponent,
  BarbershopConfigHeaderComponent,
  ConfirmDeleteModalComponent,
} from '@admin/barbershop-config/components';
import { BarbershopConfigBarberStore } from '@admin/barbershop-config/data/stores';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { first, map } from 'rxjs';
import { IConfirmDeleteModalData } from '@admin/barbershop-config/data/types';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-barbershop-config-barber',
  standalone: true,
  providers: [BarbershopConfigBarberStore],
  imports: [
    MatTableModule,
    TranslocoDirective,
    GetImgUrlPipe,
    MatPaginatorModule,
    MatIcon,
    MatButtonModule,
    BarbershopConfigHeaderComponent,
    SpinnerComponent,
  ],
  templateUrl: './barbershop-config-barber.component.html',
  styleUrl: './barbershop-config-barber.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigBarberComponent {
  #barbershopConfigBarberStore = inject(BarbershopConfigBarberStore);
  #breakPointObserver = inject(BreakpointObserver);
  #injector = inject(Injector);
  #dialog = inject(MatDialog);
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.barbers.';
  readonly displayedColumns: string[] = [
    'action',
    'photo',
    'firstName',
    'lastName',
    'email',
  ];

  pagination = this.#barbershopConfigBarberStore.pagination;
  barbers = this.#barbershopConfigBarberStore.barbers;
  isLoading = this.#barbershopConfigBarberStore.loading;
  isLoaded = this.#barbershopConfigBarberStore.loaded;
  isMobile = toSignal(
    this.#breakPointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches))
  );

  canCreateMoreEmployees =
    this.#barbershopConfigBarberStore.canCreateMoreEmployees;

  handlePageEvent(event: PageEvent) {
    this.#barbershopConfigBarberStore.setBarbershopPaginator(event);
  }

  opeDeleteDialog(barberDocId: string): void {
    const dialogRef = this.#dialog.open<
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
          this.#barbershopConfigBarberStore.deleteBarber(barberDocId);
        }
      });
  }
  openCreateBarberDialog(): void {
    this.#dialog.open<AddNewBarberModalComponent>(AddNewBarberModalComponent, {
      injector: this.#injector,
      panelClass: ['s-large-dialog'],
    });
  }
}
