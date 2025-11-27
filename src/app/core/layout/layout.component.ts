import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterNavigatorComponent } from '../footer-navigator/footer-navigator.component';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { MatIcon } from '@angular/material/icon';
import { UserType } from '../types/user-type.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterNavigatorComponent,
    RouterOutlet,
    TranslocoPipe,
    TranslocoDirective,
    MatIcon,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  #activatedRoute = inject(ActivatedRoute);
  #router = inject(Router);
  isBarbershopInactive = toSignal<boolean>(
    this.#activatedRoute.data.pipe(
      map(
        ({ isBarbershopActive, userType }) =>
          !isBarbershopActive && userType !== UserType.CLIENT
      )
    )
  );
  isSubscriptionPage = toSignal<boolean>(
    this.#router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.url.includes('subscription'))
    )
  );
  isLandingPage = toSignal<boolean>(
    this.#activatedRoute.data.pipe(map(({ isLandingPage }) => isLandingPage))
  );
}
