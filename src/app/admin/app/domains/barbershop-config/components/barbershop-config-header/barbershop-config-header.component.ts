import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-barbershop-config-header',
  standalone: true,
  imports: [TranslocoPipe,
    TranslocoDirective, MatIcon, MatButtonModule],
  templateUrl: './barbershop-config-header.component.html',
  styleUrl: './barbershop-config-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigHeaderComponent {
  title = input.required<string>();
  description = input.required<string>();
  icon = input<string>('add');
  hasAction = input<boolean>(true);
  onActionClick = output<void>();
}
