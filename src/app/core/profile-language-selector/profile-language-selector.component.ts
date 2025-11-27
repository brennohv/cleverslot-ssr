import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { IProfileContentView } from '../types/profile-content-view.model';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { shareReplay, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

@Component({
  selector: 'app-profile-language-selector',
  standalone: true,
  imports: [MatIcon, TranslocoDirective],
  providers: [provideNativeDateAdapter()],
  templateUrl: './profile-language-selector.component.html',
  styleUrl: './profile-language-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileLanguageSelectorComponent {
  #translocoService = inject(TranslocoService);
  #platformId = inject(PLATFORM_ID);
  #dateAdapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  #cookieService = inject(SsrCookieService);

  #lang$ = this.#translocoService.langChanges$.pipe(
    startWith(
      isPlatformBrowser(this.#platformId)
        ? localStorage.getItem('language') || 'pt'
        : 'pt'
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  currentLang = toSignal(this.#lang$);
  changeViewEvent = output<IProfileContentView>();
  closeModalEvent = output<boolean>();
  readonly IProfileContentView = IProfileContentView;

  setLanguage(lang: string): void {
    this.setLanguageOnLocalStorage(lang);
    this.storeLanguageInCookies(lang);
    this.#translocoService.setActiveLang(lang);
    this.changeViewEvent.emit(IProfileContentView.DEFAULT);
    this.closeModalEvent.emit(true);
  }

  private storeLanguageInCookies(lang: string) {
    this.#cookieService.set('lang', lang);
  }

  private setLanguageOnLocalStorage(lang: string): void {
    const materialLang = lang.includes('pt') ? 'pt-PT' : 'en-US';
    this.#dateAdapter.setLocale(materialLang);
    if (isPlatformBrowser(this.#platformId)) {
      localStorage.setItem('materialLanguage', materialLang);
      localStorage.setItem('language', lang);
    }
  }
}
