import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  inject,
  model,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { TranslocoPipe, TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { shareReplay, startWith } from 'rxjs';

@Component({
  selector: 'app-date-picker-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatCardModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './date-picker-dialog.component.html',
  styleUrl: './date-picker-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerDialogComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.barbershop-schedule.picker-dialog.';
  selected = model<Date | null>(null);
  #adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  #destroyRef = inject(DestroyRef);
  #translocoService = inject(TranslocoService);
  #platformId = inject(PLATFORM_ID);
  #lang$ = this.#translocoService.langChanges$.pipe(
    startWith(
      isPlatformBrowser(this.#platformId)
        ? localStorage.getItem('language') || 'pt'
        : 'pt'
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  currentLanguage = toSignal(this.#lang$);

  constructor(
    public dialogRef: MatDialogRef<DatePickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date }
  ) {}

  ngOnInit(): void {
    this.selected.update(() => this.data.date);
    this.#lang$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe((lang) => {
      const materialLang = lang.includes('pt') ? 'pt-PT' : 'en-US';
      this.#adapter.setLocale(materialLang);
    });
  }

  apply() {
    this.dialogRef.close(this.selected());
  }
  close() {
    this.dialogRef.close();
  }
}
