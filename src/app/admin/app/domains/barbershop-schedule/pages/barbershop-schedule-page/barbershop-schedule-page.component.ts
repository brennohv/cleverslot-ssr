import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
  OnInit,
} from '@angular/core';

import { BarbershopScheduleStore } from '@admin/barbershop-schedule/data/stores';
import { BarbershopFullCalendarComponent } from '@admin/barbershop-schedule/components';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerComponent } from 'ba-ngrx-signal-based';

@Component({
  selector: 'app-barber-schedule-page',
  standalone: true,
  imports: [
    BarbershopFullCalendarComponent,
    TranslocoPipe,
    TranslocoDirective,
    MatButtonModule,
    SpinnerComponent,
  ],
  providers: [BarbershopScheduleStore],
  templateUrl: './barbershop-schedule-page.component.html',
  styleUrl: './barbershop-schedule-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopSchedulePageComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-schedule.schedule-page.';
  #barbershopScheduleStore = inject(BarbershopScheduleStore);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #injector = inject(Injector);
  isLoading = this.#barbershopScheduleStore.professionalLoading;
  isLoaded = this.#barbershopScheduleStore.professionalLoaded;
  professionalList = this.#barbershopScheduleStore.professionalList;
  businessHours = this.#barbershopScheduleStore.businessHours;
  currentDate = new Date();

  ngOnInit(): void {
    afterNextRender(
      () => {
        this.#barbershopScheduleStore.getProfessionalList();
        this.#barbershopScheduleStore.getBarbershopBusinessHour();
      },
      { injector: this.#injector }
    );
  }

  navigateSetup(): void {
    this.#router.navigate(['barbershop-config'], {
      relativeTo: this.#route.parent,
      queryParams: { view: 'BARBERS' },
    });
  }
}
