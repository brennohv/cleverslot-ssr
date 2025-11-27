import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { BarbershopConfigServicesStore } from '@admin/barbershop-config/data/stores';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  GetImgUrlPipe,
  InputComponent,
  SpinnerComponent,
  SpinnerDirective,
} from 'ba-ngrx-signal-based';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { first, map, tap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import {
  IBarbershopConfigService,
  INewServiceDialog,
} from '@admin/barbershop-config/data/types';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import {
  BarbershopConfigHeaderComponent,
  AddNewServiceModalComponent,
} from '@admin/barbershop-config/components';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-barbershop-config-services',
  standalone: true,
  providers: [BarbershopConfigServicesStore],
  imports: [
    MatTableModule,
    TranslocoPipe,
    TranslocoDirective,
    GetImgUrlPipe,
    MatPaginatorModule,
    SpinnerDirective,
    MatIcon,
    MatButtonModule,
    MatSlideToggleModule,
    BarbershopConfigHeaderComponent,
    InputComponent,
    SpinnerComponent,
  ],
  templateUrl: './barbershop-config-services.component.html',
  styleUrl: './barbershop-config-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigServicesComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.config-services.';
  readonly displayedColumns: string[] = [
    'action',
    'isActive',
    'photo',
    'name',
    'duration',
    'professionalPercentage',
    'value',
    'profit',
  ];
  #barbershopConfigServicesStore = inject(BarbershopConfigServicesStore);
  #breakPointObserver = inject(BreakpointObserver);
  #injector = inject(Injector);
  isMobile = toSignal(
    this.#breakPointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches))
  );
  pagination = this.#barbershopConfigServicesStore.pagination;
  searchForm = new FormControl<string>('', { nonNullable: true });
  services = this.#barbershopConfigServicesStore.services;
  isLoading = this.#barbershopConfigServicesStore.loading;
  isLoaded = this.#barbershopConfigServicesStore.loaded;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.#barbershopConfigServicesStore.getBarbershopServicesList(
      this.searchForm.valueChanges.pipe(
        tap(() => this.#barbershopConfigServicesStore.resetPagination())
      )
    );
  }

  handlePageEvent(event: PageEvent) {
    this.#barbershopConfigServicesStore.setBarbershopPaginator(event);
  }

  enableDisableService(service: IBarbershopConfigService): void {
    this.#barbershopConfigServicesStore.enableDisableService(service);
  }

  openEditServiceDialog(service: IBarbershopConfigService): void {
    const dialogRef = this.dialog.open<
      AddNewServiceModalComponent,
      IBarbershopConfigService,
      INewServiceDialog | null
    >(AddNewServiceModalComponent, {
      panelClass: ['s-large-dialog'],
      injector: this.#injector,
      data: {
        ...service,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((resp) => {
        if (resp) {
          this.#barbershopConfigServicesStore.updateServiceSetup({
            ...resp,
            isActive: service.isActive,
            documentId: service.documentId,
          });
        }
      });
  }

  openCreateServiceDialog(): void {
    const dialogRef = this.dialog.open<AddNewServiceModalComponent>(
      AddNewServiceModalComponent,
      {
        injector: this.#injector,
        panelClass: ['s-large-dialog'],
      }
    );

    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((resp) => {
        if (resp) {
          this.#barbershopConfigServicesStore.createServiceSetup(resp);
        }
      });
  }
}
