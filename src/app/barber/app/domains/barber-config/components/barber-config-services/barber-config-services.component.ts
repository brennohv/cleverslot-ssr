import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BarberConfigServicesStore } from '@barber/barber-config/data/stores';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  GetImgUrlPipe,
  InputComponent,
  SpinnerDirective,
} from 'ba-ngrx-signal-based';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-barber-config-services',
  standalone: true,
  providers: [BarberConfigServicesStore],
  imports: [
    MatTableModule,
    MatCheckboxModule,
    TranslocoPipe,
    GetImgUrlPipe,
    MatPaginatorModule,
    SpinnerDirective,
    InputComponent,
  ],
  templateUrl: './barber-config-services.component.html',
  styleUrl: './barber-config-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarberConfigServicesComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfBarber.barber-config.config-services.';
  #barberConfigServicesStore = inject(BarberConfigServicesStore);
  #breakPointObserver = inject(BreakpointObserver);
  isMobile = toSignal(
    this.#breakPointObserver
      .observe([Breakpoints.XSmall])
      .pipe(map((result) => result.matches)),
  );
  pagination = this.#barberConfigServicesStore.pagination;
  searchForm = new FormControl<string>('', { nonNullable: true });
  displayedColumns: string[] = [
    'checkbox',
    'photo',
    'name',
    'duration',
    'professionalPercentage',
    'value',
  ];
  dataSource = this.#barberConfigServicesStore.services;
  isLoading = this.#barberConfigServicesStore.loading;

  ngOnInit(): void {
    this.#barberConfigServicesStore.getBarbershopServicesList(
      this.searchForm.valueChanges.pipe(
        tap(() => this.#barberConfigServicesStore.resetPagination()),
      ),
    );
  }

  toggleService(documentId: string): void {
    this.#barberConfigServicesStore.updateBarberServices(documentId);
  }

  handlePageEvent(event: PageEvent) {
    this.#barberConfigServicesStore.setBarbershopPaginator(event);
  }
}
