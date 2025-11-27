import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import dayjs from 'dayjs';
import 'dayjs/locale/pt.js';
import 'dayjs/locale/en.js';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { map, Observable } from 'rxjs';

// Enable the plugin
dayjs.extend(localizedFormat);

@Pipe({
  name: 'dayFormat',
  standalone: true,
})
export class DayFormatPipe implements PipeTransform {
  #translocoService = inject(TranslocoService);
  transform(date: string): Observable<string> {
    return this.#translocoService.langChanges$.pipe(
      map((lang) => dayjs(date).locale(lang).format('DD'))
    );
  }
}
