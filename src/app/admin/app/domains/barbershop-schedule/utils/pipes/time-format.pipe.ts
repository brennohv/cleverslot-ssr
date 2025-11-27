import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string | null): string | null {
    if (!value) return null;
    const parts = value.split(':');
    const [hour, minutes] = parts;
    if (parts.length >= 2) {
      return `${hour}:${minutes}`;
    }
    return value;
  }
}
