import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { IBarberConfigViewEnum } from '@barber/barber-config/data/types';
import { BarberConfigNavService } from '@barber/barber-config/data/services';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-barber-config-nav',
  standalone: true,
  imports: [
    MatListModule,
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    TranslocoPipe,
  ],
  templateUrl: './barber-config-nav.component.html',
  styleUrl: './barber-config-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarberConfigNavComponent {
  readonly I18N_PREFFIX = 'mfBarber.barber-config.config-nav.';
  readonly IBarberConfigViewEnum = IBarberConfigViewEnum;
  #barberConfigNavService = inject(BarberConfigNavService);
  barberConfigView = this.#barberConfigNavService.currentView;
  readonly links = [
    {
      viewReference: IBarberConfigViewEnum.PROFILE,
      label: `${this.I18N_PREFFIX}profile`,
      icon: 'person',
    },
    {
      viewReference: IBarberConfigViewEnum.SERVICES,
      label: `${this.I18N_PREFFIX}services`,
      icon: 'content_cut',
    },
  ];
  viewSelected = computed(() => {
    const selectedLink = this.links.find(
      (link) => link.viewReference === this.barberConfigView(),
    );
    return selectedLink;
  });

  updateView(view: IBarberConfigViewEnum): void {
    this.#barberConfigNavService.updateView(view);
  }

  updateViewSelect(event: MatSelectChange): void {
    this.#barberConfigNavService.updateView(event.value);
  }
}
