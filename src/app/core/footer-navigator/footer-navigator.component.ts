import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, fromEvent, map, of, throttleTime } from 'rxjs';
import { UserType } from '../types/user-type.model';
import { UserStore } from 'ba-ngrx-signal-based';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-footer-navigator',
  standalone: true,
  imports: [MatTabsModule, RouterLink, MatIconModule, AsyncPipe, TranslocoPipe,
    TranslocoDirective],
  templateUrl: './footer-navigator.component.html',
  styleUrl: './footer-navigator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterNavigatorComponent {
  #cdr = inject(ChangeDetectorRef);
  #route = inject(ActivatedRoute);
  #userStore = inject(UserStore);
  barber = this.#userStore.barber;
  admin = this.#userStore.admin;
  #platformId = inject(PLATFORM_ID);
  readonly throttleTime = 50;
  readonly UserType = UserType;
  scrollY: number;
  isHideShowSetup$ = isPlatformBrowser(this.#platformId)
    ? fromEvent(window, 'scroll').pipe(
        throttleTime(this.throttleTime),
        map(() => {
          const currentScrollY = window.scrollY;
          const viewportHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const isBottom =
            currentScrollY + viewportHeight + 48 >= documentHeight;

          if (isBottom) {
            return false;
          }

          const shouldHideFooter = currentScrollY > this.scrollY;
          this.scrollY = currentScrollY;
          this.#cdr.detectChanges();

          return shouldHideFooter;
        })
      )
    : of(false);

  userType$: Observable<UserType> = this.#route.data.pipe(
    map((data) => data['userType'])
  );
}
