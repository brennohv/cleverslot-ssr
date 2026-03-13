import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BarberConfigNavComponent,
  BarberConfigProfileComponent,
  BarberConfigServicesComponent,
} from '@barber/barber-config/components';
import { IBarberConfigViewEnum } from '@barber/barber-config/data/types';
import { BarberConfigNavService } from '@barber/barber-config/data/services';
import { BarberConfigStore } from '@barber/barber-config/data/stores';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-barber-config-page',
  standalone: true,
  imports: [
    BarberConfigNavComponent,
    BarberConfigProfileComponent,
    BarberConfigServicesComponent,
    TranslocoPipe,
  ],
  providers: [BarberConfigStore, BarberConfigNavService],
  templateUrl: './barber-config-page.component.html',
  styleUrl: './barber-config-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarberConfigPageComponent {
  #barberConfigNavService = inject(BarberConfigNavService);
  barberConfigView = this.#barberConfigNavService.currentView;
  readonly IBarberConfigViewEnum = IBarberConfigViewEnum;
  readonly I18N_PREFFIX = 'mfBarber.barber-config.main-page.';
}
