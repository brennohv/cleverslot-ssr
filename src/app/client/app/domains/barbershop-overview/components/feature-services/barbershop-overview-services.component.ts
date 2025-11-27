import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  input,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import {
  AuthStore,
  GetImgUrlPipe,
  InputComponent,
  SpinnerDirective,
  UserStore,
} from 'ba-ngrx-signal-based';
import { FreeSlotsModalData } from '@client/barbershop-overview/data/types';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { FreeSlotsDialogComponent } from '@client/barbershop-overview/components';
import { CurrencyPipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { BarbershopServiceStore } from '@client/barbershop-overview/data/stores';
import { map, startWith, tap } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-barbershop-overview-services',
  standalone: true,
  providers: [BarbershopServiceStore],
  imports: [
    GetImgUrlPipe,
    MatDividerModule,
    MatButtonModule,
    TranslocoPipe,
    TranslocoDirective,
    CurrencyPipe,
    InputComponent,
    MatPaginatorModule,
    SpinnerDirective,
  ],
  templateUrl: './barbershop-overview-services.component.html',
  styleUrl: './barbershop-overview-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopOverviewServicesComponent implements OnInit {
  #userStore = inject(UserStore);
  #authStore = inject(AuthStore);
  #barbershopServiceStore = inject(BarbershopServiceStore);
  #breakPointObserver = inject(BreakpointObserver);
  #injector = inject(Injector);
  #router = inject(Router);
  barbershopSlug = input.required<string>();
  barbershopId = input.required<string>();
  searchForm = new FormControl<string>('', { nonNullable: true });
  serviceList = this.#barbershopServiceStore.services;
  pagination = this.#barbershopServiceStore.pagination;
  isLoading = this.#barbershopServiceStore.loading;
  isMobile = toSignal(
    this.#breakPointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches))
  );

  readonly I18N_PREFFIX = 'mfClient.barbershop-overview.services.';

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    afterNextRender(
      () => {
        this.#barbershopServiceStore.getBarbershopServicesList(
          this.searchForm.valueChanges.pipe(
            tap(() => this.#barbershopServiceStore.resetPagination()),
            startWith(''),
            map((value) => ({
              serviceName: value,
              barbershopDocId: this.barbershopId(),
            }))
          )
        );
      },
      { injector: this.#injector }
    );
  }

  openDialog(serviceId: string): void {
    if (this.isAuthenticated()) {
      this.dialog.open<FreeSlotsDialogComponent, FreeSlotsModalData>(
        FreeSlotsDialogComponent,
        {
          panelClass: ['free-slots-dialog'],
          data: { barbershopId: this.barbershopId(), serviceId: serviceId },
        }
      );
    } else {
      this.#router.navigate(['../auth/login'], {
        queryParams: { redirectTo: this.barbershopSlug() },
      });
    }
  }

  isAuthenticated(): boolean {
    return !!this.#authStore.token() && !!this.#userStore.documentId();
  }

  handlePageEvent(event: PageEvent) {
    this.#barbershopServiceStore.setBarbershopPaginator(event);
  }
}
