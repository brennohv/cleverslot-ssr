import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

export interface ISuccessModalData {
  title: string;
  description: string;
}

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuccessModalComponent implements OnInit {
  readonly I18N_PREFFIX = 'mfAdmin.landing-page.success-modal.';
  title = signal<string>('');
  description = signal<string>('');

  constructor(
    public dialogRef: MatDialogRef<SuccessModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ISuccessModalData
  ) {}

  ngOnInit(): void {
    this.getDataFromInjection();
  }

  private getDataFromInjection() {
    const { description, title } = this.data;
    this.title.update(() => title);
    this.description.update(() => description);
  }
}
