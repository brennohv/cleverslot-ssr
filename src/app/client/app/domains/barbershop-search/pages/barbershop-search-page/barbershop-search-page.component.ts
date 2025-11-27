import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Injector,
  OnInit,
  afterNextRender,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  InputComponent,
  UserStore,
  GetImgUrlPipe,
  SpinnerComponent,
} from 'ba-ngrx-signal-based';
import dayjs from 'dayjs';
import 'dayjs/locale/pt.js';
import 'dayjs/locale/en.js';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { map, Observable, startWith, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBarbershopStore } from '@client/barbershop-search/data/stores';
import { BarbershopAddressPipe } from '@client/shared/utils/pipes';
import { TranslocoPipe, TranslocoDirective, TranslocoService } from '@jsverse/transloco';

// Enable the plugin
dayjs.extend(localizedFormat);

@Component({
  selector: 'app-barbershop-search-page',
  standalone: true,
  providers: [SearchBarbershopStore],
  imports: [
    InputComponent,
    CommonModule,
    GetImgUrlPipe,
    MatIconModule,
    MatCardModule,
    BarbershopAddressPipe,
    MatButtonModule,
    RouterLink,
    SpinnerComponent,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './barbershop-search-page.component.html',
  styleUrl: './barbershop-search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopSearchPageComponent implements OnInit {
  #userStore = inject(UserStore);
  #searchBarbershopStore = inject(SearchBarbershopStore);
  #destroyRef = inject(DestroyRef);
  #translocoService = inject(TranslocoService);
  #injector = inject(Injector);
  barberShopList = this.#searchBarbershopStore.barbershops;
  isLoaded = this.#searchBarbershopStore.loaded;
  isGetMoreLoading = this.#searchBarbershopStore.getMoreLoading;
  hasMoreBarbershop = this.#searchBarbershopStore.hasMoreDataFromService;
  user = this.#userStore;
  today$ = this.#translocoService.langChanges$.pipe(
    map((lang) => dayjs().locale(lang).format('dddd'))
  );
  date$ = this.#translocoService.langChanges$.pipe(
    map((lang) => dayjs().locale(lang).format('LL'))
  );
  searchForm = new FormControl<string>('', { nonNullable: true });
  readonly I18N_PREFFIX = 'mfClient.search-barbershop.';

  ngOnInit(): void {
    afterNextRender(
      () => {
        this.setFilterNameSetup().subscribe();
      },
      { injector: this.#injector }
    );
  }

  getMoreSetup(): void {
    this.#searchBarbershopStore.setNextPage();
  }

  setFilterNameSetup(): Observable<string> {
    return this.searchForm.valueChanges.pipe(startWith('')).pipe(
      takeUntilDestroyed(this.#destroyRef),
      tap((name) => this.#searchBarbershopStore.setNameFilter(name))
    );
  }
}
