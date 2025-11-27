import { Pipe, PipeTransform } from '@angular/core';
import { IAddress } from 'ba-ngrx-signal-based';

@Pipe({
  name: 'barbershopAddress',
  standalone: true,
})
export class BarbershopAddressPipe implements PipeTransform {
  transform(value: IAddress): string {
    if (!value) {
      return '-';
    }

    return `${value.street} ${value.number}, ${value.postalCode} ${
      value.city || ''
    }`;
  }
}
