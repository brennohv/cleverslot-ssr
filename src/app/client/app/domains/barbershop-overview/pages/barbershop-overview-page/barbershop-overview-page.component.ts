import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  afterNextRender,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetImgUrlPipe, SpinnerComponent } from 'ba-ngrx-signal-based';
import { MatButtonModule } from '@angular/material/button';
import { filter, map } from 'rxjs';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { BarbershopOverviewStore } from '@client/barbershop-overview/data/stores';
import { BarbershopOverviewSidebarComponent } from '@client/barbershop-overview/components';
import { BarbershopOverviewServicesComponent } from '@client/barbershop-overview/components';

@Component({
  selector: 'app-barbershop-overview-page',
  standalone: true,
  providers: [BarbershopOverviewStore],
  imports: [
    CommonModule,
    CarouselModule,
    GetImgUrlPipe,
    MatButtonModule,
    MatIcon,
    BarbershopOverviewSidebarComponent,
    MatDividerModule,
    MatCardModule,
    BarbershopOverviewServicesComponent,
    SpinnerComponent,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './barbershop-overview-page.component.html',
  styleUrl: './barbershop-overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopOverviewPageComponent implements OnInit {
  #route = inject(ActivatedRoute);
  #barbershopOverviewStore = inject(BarbershopOverviewStore);
  #injector = inject(Injector);
  barbershop = this.#barbershopOverviewStore.barbershop;
  isLoaded = this.#barbershopOverviewStore.loaded;
  slug$ = this.#route.paramMap.pipe(
    filter((params) => !!params.get('barbershopSlug')),
    map((params) => params.get('barbershopSlug') || '')
  );
  customOptions: OwlOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    loop: false,
    margin: 5,
    nav: false,
    dots: true,
    dotsEach: true,
    navSpeed: 700,
    autoHeight: false,
    autoWidth: false,
    items: 1,
  };

  ngOnInit(): void {
    afterNextRender(
      () => {
        this.#barbershopOverviewStore.getBarbershopBySlug(this.slug$);
      },
      { injector: this.#injector }
    );
  }

  scrollToServices(el: HTMLElement): void {
    el.scrollIntoView();
  }
}
