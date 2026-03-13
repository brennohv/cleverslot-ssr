import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  DatePickerInputComponent,
  GetImgUrlPipe,
  SpinnerDirective,
} from 'ba-ngrx-signal-based';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';
import dayjs from 'dayjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BarberComissionsStore } from '@barber/barber-comissions/data/stores';
import {
  DayFormatPipe,
  TimeFormatPipe,
} from '@barber/barber-comissions/utils/pipes';
import { IServiceComissions } from '@barber/barber-comissions/data/types';

@Component({
  selector: 'app-barber-comissions-page',
  standalone: true,
  providers: [BarberComissionsStore],
  imports: [
    MatTableModule,
    TranslocoPipe,
    GetImgUrlPipe,
    MatIconModule,
    MatButtonModule,
    CurrencyPipe,
    DatePickerInputComponent,
    TimeFormatPipe,
    DayFormatPipe,
    AsyncPipe,
    SpinnerDirective,
  ],
  templateUrl: './barber-comissions-page.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  styleUrl: './barber-comissions-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaarberComissionsPageComponent implements OnInit {
  #barberComissionsService = inject(BarberComissionsStore);
  readonly I18N_PREFFIX = 'mfBarber.barber-comissions.';
  services = this.#barberComissionsService.services;
  salary = this.#barberComissionsService.salary;
  recurrency = this.#barberComissionsService.recurrency;
  isLoading = this.#barberComissionsService.loading;
  displayedColumns: string[] = ['photo', 'name', 'quantity', 'totalValue'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: IServiceComissions | null;

  filterForm = this.fb.group({
    startDate: new FormControl(new Date(), {
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
    map((date) => (dayjs(date).isValid() ? date : new Date())),
  );

  minEndDate = toSignal(this.minEndDate$);
  private destroyRef = inject(DestroyRef);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const { startDate, endDate } = this.filterForm.getRawValue();
    this.#barberComissionsService.getBarberComissions(
      this.filterForm.valueChanges.pipe(startWith({ startDate, endDate })),
    );
    this.clearEndDateSetup().subscribe();
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
      }),
    );
  }

  setExpandedElement(element: IServiceComissions, event: Event): void {
    this.expandedElement = this.expandedElement === element ? null : element;
    event.stopPropagation();
  }
}
