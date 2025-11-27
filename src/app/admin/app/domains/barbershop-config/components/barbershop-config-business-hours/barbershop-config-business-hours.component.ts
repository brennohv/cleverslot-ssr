import {
  ChangeDetectionStrategy,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import { BarbershopConfigBusinessHoursStore } from '@admin/barbershop-config/data/stores';
import { BarbershopConfigHeaderComponent } from '../barbershop-config-header/barbershop-config-header.component';
import { BarbershopConfigCardComponent } from '../barbershop-config-card/barbershop-config-card.component';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  IInputType,
  InputComponent,
  SpinnerComponent,
  SpinnerDirective,
} from 'ba-ngrx-signal-based';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  IBusinessHourStore,
  PossibleBusinessHourEntries,
} from '@admin/barbershop-config/data/types';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-barbershop-config-business-hours',
  standalone: true,
  imports: [
    BarbershopConfigHeaderComponent,
    BarbershopConfigCardComponent,
    TranslocoPipe,
    TranslocoDirective,
    InputComponent,
    FormsModule,
    MatDivider,
    MatSlideToggleModule,
    MatButtonModule,
    SpinnerComponent,
    SpinnerDirective,
    MatIcon,
  ],
  providers: [BarbershopConfigBusinessHoursStore],
  templateUrl: './barbershop-config-business-hours.component.html',
  styleUrl: './barbershop-config-business-hours.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigBusinessHoursComponent {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.config-business-hours.';
  readonly IInputType = IInputType;
  #businessHoursStore = inject(BarbershopConfigBusinessHoursStore);
  businessHours = this.#businessHoursStore.businessHours;
  isLoaded = this.#businessHoursStore.loaded;
  isLoading = this.#businessHoursStore.loading;

  businnesHoursForm = viewChild<NgForm>('businnesHoursForm');

  enableDisableBusinessHour(dayObj: IBusinessHourStore): void {
    this.#businessHoursStore.toggleActiveBusinessHour(dayObj);
  }

  enableSecondPeriodBusinessHour(dayObj: IBusinessHourStore): void {
    this.#businessHoursStore.toggleSecondPeriodActiveBusinessHour(dayObj);
  }

  onChangeBusinessHour(
    value: string,
    day: string,
    entry: PossibleBusinessHourEntries
  ): void {
    this.#businessHoursStore.businessHourChange({ value, day, entry });
  }

  saveChanges(): void {
    this.#businessHoursStore.updateBarbershopBusinnessHours();
  }
}
