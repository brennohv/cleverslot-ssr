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
import { IConfirmDeleteModalData } from '@admin/barbershop-config/data/types';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './confirm-delete-modal.component.html',
  styleUrl: './confirm-delete-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDeleteModalComponent implements OnInit {
  title = signal<string>('');
  description = signal<string>('');

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IConfirmDeleteModalData
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
