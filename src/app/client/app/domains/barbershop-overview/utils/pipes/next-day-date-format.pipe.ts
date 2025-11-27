import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { map, Observable } from 'rxjs';
import dayjs from 'dayjs';
import 'dayjs/locale/pt.js';
import 'dayjs/locale/en.js';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

@Pipe({
  name: 'nextDayDateFormat',
  standalone: true,
})
export class NextDayDateFormatPipe implements PipeTransform {
  #translocoService = inject(TranslocoService);
  transform(date: string | null): Observable<string> {
    return this.#translocoService.langChanges$.pipe(
      map((lang) =>
        dayjs(date)
          .locale(lang)
          .format(lang === 'pt' ? 'DD/MM' : 'MM/DD')
      )
    );
  }
}
