import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BarbershopConfigClientStore } from '@admin/barbershop-config/data/stores';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  GetImgUrlPipe,
  InputComponent,
  SpinnerComponent,
  SpinnerDirective,
} from 'ba-ngrx-signal-based';
import { BarbershopConfigHeaderComponent } from '../barbershop-config-header/barbershop-config-header.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, tap } from 'rxjs';

import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddNewClientModalComponent } from '../add-new-client-modal/add-new-client-modal.component';

@Component({
  selector: 'app-barbershop-config-clients',
  standalone: true,
  providers: [BarbershopConfigClientStore],
  imports: [
    MatTableModule,
    TranslocoPipe,
    TranslocoDirective,
    GetImgUrlPipe,
    MatPaginatorModule,
    SpinnerDirective,
    BarbershopConfigHeaderComponent,
    InputComponent,
    SpinnerComponent,
  ],
  templateUrl: './barbershop-config-clients.component.html',
  styleUrl: './barbershop-config-clients.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigClientsComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.clients.';
  readonly displayedColumns: string[] = [
    'photo',
    'username',
    'email',
    'telephone',
  ];
  #barbershopConfigClientStore = inject(BarbershopConfigClientStore);
  #breakPointObserver = inject(BreakpointObserver);
  #injector = inject(Injector);
  #dialog = inject(MatDialog);
  isLoading = this.#barbershopConfigClientStore.loading;
  isLoaded = this.#barbershopConfigClientStore.loaded;
  pagination = this.#barbershopConfigClientStore.pagination;
  clients = this.#barbershopConfigClientStore.clients;
  isMobile = toSignal(
    this.#breakPointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches))
  );
  searchForm = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    afterNextRender(
      () => {
        this.#barbershopConfigClientStore.getClientList(
          this.searchForm.valueChanges.pipe(
            tap(() => this.#barbershopConfigClientStore.resetPagination())
          )
        );
      },
      { injector: this.#injector }
    );
  }
  handlePageEvent(event: PageEvent) {
    this.#barbershopConfigClientStore.setBarbershopPaginator(event);
  }

  openCreateClientDialog(): void {
    this.#dialog.open<AddNewClientModalComponent>(AddNewClientModalComponent, {
      injector: this.#injector,
      panelClass: ['s-large-dialog'],
    });
  }
}
