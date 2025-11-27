import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore, UserStore } from 'ba-ngrx-signal-based';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { Observable, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserType } from '../types/user-type.model';
import { TranslocoDirective } from '@jsverse/transloco';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    ProfileMenuComponent,
    TranslocoDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isOpenMenu = signal(false);
  #authStore = inject(AuthStore);
  #userStore = inject(UserStore);
  #router = inject(Router);
  #route = inject(ActivatedRoute);
  #userType$: Observable<UserType> = this.#route.data.pipe(
    map((data) => data['userType'])
  );
  userType = toSignal<UserType>(this.#userType$);
  isLoggedIn = this.#authStore.token;
  barberProfile = this.#userStore.barber;
  adminProfile = this.#userStore.admin;

  readonly UserType = UserType;

  toggleMenu(): void {
    this.isOpenMenu.update((value) => !value);
  }

  closeMenu(): void {
    this.isOpenMenu.set(false);
  }

  logout(): void {
    this.#authStore.logout();
  }

  navigateToLogin(): void {
    this.#router.navigateByUrl('/auth/login');
  }

  navigateBasedOnProfile(): void {
    switch (this.userType()) {
      case UserType.CLIENT:
        this.#router.navigateByUrl('/');
        break;

      case UserType.PROFESSIONAL:
        this.#router.navigateByUrl(
          `/${this.barberProfile()?.barbershopSlug}/barber`
        );
        break;

      case UserType.ADMIN:
        this.#router.navigateByUrl(
          `/${this.adminProfile()?.barbershopSlug}/admin`
        );
        break;

      default:
        this.#router.navigateByUrl('/');
        break;
    }
  }
}
