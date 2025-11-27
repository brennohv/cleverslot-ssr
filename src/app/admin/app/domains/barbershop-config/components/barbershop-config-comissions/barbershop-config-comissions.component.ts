import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  OnInit,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  DatePickerInputComponent,
  GetImgUrlPipe,
  SpinnerComponent,
  SpinnerDirective,
  ValidationErrorPipe,
} from 'ba-ngrx-signal-based';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';
import dayjs from 'dayjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  DayFormatPipe,
  TimeFormatPipe,
} from '@admin/barbershop-config/utils/pipes';
import { BarbershopComissionsStore } from '@admin/barbershop-config/data/stores';
import { IServiceComissions } from '@admin/barbershop-config/data/types';
import { MatSelectModule } from '@angular/material/select';
import { BarbershopConfigHeaderComponent } from '../barbershop-config-header/barbershop-config-header.component';

@Component({
  selector: 'app-barbershop-config-comissions',
  standalone: true,
  providers: [BarbershopComissionsStore],
  imports: [
    MatTableModule,
    TranslocoPipe,
    TranslocoDirective,
    GetImgUrlPipe,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe,
    DatePickerInputComponent,
    TimeFormatPipe,
    DayFormatPipe,
    AsyncPipe,
    SpinnerDirective,
    MatSelectModule,
    ReactiveFormsModule,
    ValidationErrorPipe,
    BarbershopConfigHeaderComponent,
    SpinnerComponent,
  ],
  templateUrl: './barbershop-config-comissions.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  styleUrl: './barbershop-config-comissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigComissionsComponent implements OnInit {
  #barberComissionsService = inject(BarbershopComissionsStore);
  #injector = inject(Injector);
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-config.barbershop-comissions.';
  services = this.#barberComissionsService.services;
  salary = this.#barberComissionsService.salary;
  professionalList = this.#barberComissionsService.professionalList;
  recurrency = this.#barberComissionsService.recurrency;
  isLoaded = this.#barberComissionsService.loaded;
  isProfessionalListLoaded = this.#barberComissionsService.professionalsLoaded;
  displayedColumns: string[] = ['photo', 'name', 'quantity', 'totalValue'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: IServiceComissions | null;

  filterForm = this.fb.group({
    startDate: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    barberId: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    endDate: new FormControl<Date | undefined>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  minEndDate$ = this.filterForm.controls.startDate.valueChanges.pipe(
    startWith(this.filterForm.controls.startDate.value),
    map((date) => (dayjs(date).isValid() ? date : new Date()))
  );

  minEndDate = toSignal(this.minEndDate$);
  private destroyRef = inject(DestroyRef);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    afterNextRender(
      () => {
        this.#barberComissionsService.getProfessionalList();
        this.#barberComissionsService.getBarberComissions(
          this.filterForm.valueChanges,
          { injector: this.#injector }
        );
        this.clearEndDateSetup().subscribe();
      },
      { injector: this.#injector }
    );
  }

  clearEndDateSetup(): Observable<Date> {
    return this.filterForm.controls.startDate.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((value) => {
        const startDateMoment = dayjs(value);
        const endDateMoment = dayjs(this.filterForm.controls.endDate.value);
        if (value && startDateMoment.isAfter(endDateMoment)) {
          this.filterForm.controls.endDate.patchValue(undefined);
        }
      })
    );
  }

  setExpandedElement(element: IServiceComissions, event: Event): void {
    this.expandedElement = this.expandedElement === element ? null : element;
    event.stopPropagation();
  }
}
