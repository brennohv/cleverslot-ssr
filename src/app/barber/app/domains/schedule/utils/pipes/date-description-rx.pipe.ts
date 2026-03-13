import { inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import dayjs from 'dayjs';
import 'dayjs/locale/pt.js';
import 'dayjs/locale/en.js';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { map, Observable, startWith } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

// Enable the plugin
dayjs.extend(localizedFormat);

@Pipe({
  name: 'dateDescriptionRx',
  standalone: true,
})
export class DateDescriptionRxPipe implements PipeTransform {
  #translocoService = inject(TranslocoService);
  #platformId = inject(PLATFORM_ID);
  transform(date: string, format: string = 'LL'): Observable<string> {
    return this.#translocoService.langChanges$.pipe(
      startWith(
        isPlatformBrowser(this.#platformId)
          ? localStorage.getItem('language') || 'pt'
          : 'pt'
      ),
      map((lang) => {
        return `${dayjs(date).locale(lang).format(format)}`;
      })
    );
  }
}
