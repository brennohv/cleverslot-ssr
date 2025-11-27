import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-barbershop-config-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './barbershop-config-card.component.html',
  styleUrl: './barbershop-config-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarbershopConfigCardComponent {}
