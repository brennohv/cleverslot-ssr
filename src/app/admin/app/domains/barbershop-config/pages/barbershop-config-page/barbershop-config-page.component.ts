import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  BarbershopConfigPaymentsComponent,
  BarbershopConfigServicesComponent,
  BarbeshopConfigNavComponent,
  BarbershopConfigAddressContactComponent,
  BarbershopConfigBusinessHoursComponent,
  BarbershopConfigBrandComponent,
  BarbershopConfigBarberComponent,
  BarbershopConfigClientsComponent,
  BarbershopConfigComissionsComponent,
} from '@admin/barbershop-config/components';
import { BarbershopConfigNavService } from '@admin/barbershop-config/data/services';
import { IBarbershopConfigViewEnum } from '@admin/barbershop-config/data/types';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-barbershop-config-page',
  standalone: true,
  imports: [
    BarbeshopConfigNavComponent,
    BarbershopConfigServicesComponent,
    BarbershopConfigPaymentsComponent,
    BarbershopConfigAddressContactComponent,
    BarbershopConfigBusinessHoursComponent,
    BarbershopConfigBrandComponent,
    BarbershopConfigBarberComponent,
    BarbershopConfigClientsComponent,
    BarbershopConfigComissionsComponent,
    TranslocoDirective,
  ],
  providers: [BarbershopConfigNavService],
  templateUrl: './barbershop-config-page.component.html',
  styleUrl: './barbershop-config-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigPageComponent {
  #barbershopConfigNavService = inject(BarbershopConfigNavService);
  barbershopConfigView = this.#barbershopConfigNavService.currentView;
  readonly IBarbershopConfigViewEnum = IBarbershopConfigViewEnum;
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.main-page.';
}
