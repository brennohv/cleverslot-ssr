import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { IBarbershopConfigViewEnum } from '@admin/barbershop-config/data/types';
import { BarbershopConfigNavService } from '@admin/barbershop-config/data/services';
import { first, map, Observable, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-barbeshop-config-nav',
  standalone: true,
  imports: [
    MatListModule,
    MatIcon,
    MatFormFieldModule,
    MatSelectModule,
    TranslocoDirective,
  ],
  templateUrl: './barbeshop-config-nav.component.html',
  styleUrl: './barbeshop-config-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbeshopConfigNavComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.config-nav.';
  readonly IBarbershopConfigViewEnum = IBarbershopConfigViewEnum;
  #barbershopConfigNavService = inject(BarbershopConfigNavService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);
  barberConfigView = this.#barbershopConfigNavService.currentView;
  readonly links = [
    {
      viewReference: IBarbershopConfigViewEnum.BRAND,
      label: `${this.I18N_PREFFIX}brand-and-visuals`,
      icon: 'work',
    },
    {
      viewReference: IBarbershopConfigViewEnum.ADDRESS_AND_CONTACT,
      label: `${this.I18N_PREFFIX}address-and-contact`,
      icon: 'home',
    },
    {
      viewReference: IBarbershopConfigViewEnum.PAYMENT_METHODS,
      label: `${this.I18N_PREFFIX}payment-methods`,
      icon: 'payments',
    },
    {
      viewReference: IBarbershopConfigViewEnum.BUSINNES_HOURS,
      label: `${this.I18N_PREFFIX}business-hours`,
      icon: 'calendar_month',
    },
    {
      viewReference: IBarbershopConfigViewEnum.SERVICES,
      label: `${this.I18N_PREFFIX}services`,
      icon: 'content_cut',
    },
    {
      viewReference: IBarbershopConfigViewEnum.COMISSIONS,
      label: `${this.I18N_PREFFIX}comissions`,
      icon: 'paid',
    },
    {
      viewReference: IBarbershopConfigViewEnum.BARBERS,
      label: `${this.I18N_PREFFIX}employees`,
      icon: 'groups_2',
    },
    {
      viewReference: IBarbershopConfigViewEnum.CLIENTS,
      label: `${this.I18N_PREFFIX}clients`,
      icon: 'group',
    },
  ];
  viewSelected = computed(() => {
    const selectedLink = this.links.find(
      (link) => link.viewReference === this.barberConfigView()
    );
    return selectedLink;
  });

  ngOnInit(): void {
    this.verifyQueryParamViewSetup().subscribe();
  }

  updateView(view: IBarbershopConfigViewEnum): void {
    this.#barbershopConfigNavService.updateView(view);
    this.updateQueryParams(view);
  }

  updateViewSelect(event: MatSelectChange): void {
    this.#barbershopConfigNavService.updateView(event.value);
    this.updateQueryParams(event.value);
  }

  verifyQueryParamViewSetup(): Observable<IBarbershopConfigViewEnum> {
    return this.#route.queryParamMap.pipe(
      first(),
      map((params) => {
        return params.get('view') as IBarbershopConfigViewEnum;
      }),
      tap((view: IBarbershopConfigViewEnum) => {
        const isValidView =
          view &&
          Object.values(IBarbershopConfigViewEnum).includes(
            view as IBarbershopConfigViewEnum
          );
        if (isValidView) {
          this.#barbershopConfigNavService.updateView(view);
        }
      })
    );
  }

  private updateQueryParams(view: IBarbershopConfigViewEnum) {
    this.#router.navigate([], {
      queryParams: { view },
    });
  }
}
