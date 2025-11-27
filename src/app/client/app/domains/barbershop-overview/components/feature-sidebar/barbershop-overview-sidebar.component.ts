import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import dayjs from 'dayjs';
import {
  IBarbershopBySlug,
  IEstablishment,
} from '@client/barbershop-overview/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  BarbershopAddressPipe,
  TimeFormatPipe,
} from '@client/shared/utils/pipes';

export interface IBusinessHourCustom extends IEstablishment {
  isOpen: boolean;
}

@Component({
  selector: 'app-barbershop-overview-sidebar',
  standalone: true,
  imports: [
    BarbershopAddressPipe,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    TimeFormatPipe,
    MatChipsModule,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './barbershop-overview-sidebar.component.html',
  styleUrl: './barbershop-overview-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopOverviewSidebarComponent {
  readonly dayOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  readonly I18N_PREFFIX = 'mfClient.barbershop-overview.side-bar.';
  barbershop = input.required<IBarbershopBySlug>();
  businessHours = computed(() => {
    const addOpenPeriods = this.addIsOpenBasedOnPeriods(
      this.barbershop().establishment
    );
    const addEmptyDays = this.insertEmptyDays(addOpenPeriods);
    const sortBusiness = this.sortBusinnesHours(addEmptyDays);
    return sortBusiness;
  });

  whatsappNumber = computed(() => {
    return this.barbershop().telephone?.internationalNumber.replace(
      /(?<=\w)\s+(?=\w)/g,
      ''
    );
  });
  today = dayjs().format('dddd');

  private addIsOpenBasedOnPeriods(
    businessHours: IEstablishment[]
  ): IBusinessHourCustom[] {
    return [
      ...businessHours.map((dayObj) => {
        return {
          ...dayObj,
          isOpen: !!dayObj.firstPeriodStart && !!dayObj.firstPeriodEnd,
        };
      }),
    ];
  }

  private insertEmptyDays(
    businessHour: IBusinessHourCustom[]
  ): IBusinessHourCustom[] {
    this.dayOrder.map((day) => {
      if (!businessHour.some((dayObj) => dayObj.day === day)) {
        businessHour.push({
          day,
          firstPeriodStart: '',
          firstPeriodEnd: '',
          secondPeriodEnd: '',
          secondPeriodStart: '',
          isOpen: false,
        });
      }
    });

    return businessHour;
  }

  private sortBusinnesHours(
    businessHours: IBusinessHourCustom[]
  ): IBusinessHourCustom[] {
    return [...businessHours].sort(
      (a, b) => this.dayOrder.indexOf(a.day) - this.dayOrder.indexOf(b.day)
    );
  }
}
