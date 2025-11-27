import {
  ApplicationConfig,
  inject,
  isDevMode,
  PLATFORM_ID,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { graphqlProvider } from '../../graphql.provider';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco, TranslocoService } from '@jsverse/transloco';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { authenticationInterceptor } from './http-interceptors/authentication.interceptor';
import { LIBRARY_ENV, IEnvironment } from 'ba-ngrx-signal-based';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { SsrCookieService } from 'ngx-cookie-service-ssr';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: LIBRARY_ENV,
      useValue: environment as IEnvironment,
    },
    provideRouter(routes, withViewTransitions({ skipInitialTransition: true })),
    graphqlProvider(),
    provideAnimations(),
    {
      provide: MAT_DATE_LOCALE,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);

        if (isPlatformBrowser(platformId)) {
          return localStorage.getItem('materialLanguage') ?? 'pt-PT';
        }

        return 'pt-PT';
      },
    },
    provideToastr({ timeOut: 3000, preventDuplicates: true }),
    provideTransloco({
      config: {
        availableLangs: ['pt', 'en'],
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAppInitializer(() => {
      const cookieService = inject(SsrCookieService);
      const translocoService = inject(TranslocoService);

      if (cookieService.check('lang')) {
        translocoService.setActiveLang(cookieService.get('lang'));
      }
    }),
    provideHttpClient(
      withInterceptors([authenticationInterceptor]),
      withFetch()
    ),
    provideClientHydration(withEventReplay()),
  ],
};
