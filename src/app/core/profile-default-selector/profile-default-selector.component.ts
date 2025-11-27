import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { AuthStore, GetImgUrlPipe, UserStore } from 'ba-ngrx-signal-based';
import { shareReplay, startWith } from 'rxjs';
import { IProfileContentView } from '../types/profile-content-view.model';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile-default-selector',
  standalone: true,
  imports: [TranslocoDirective, MatIcon, RouterLink, GetImgUrlPipe, NgIf],
  templateUrl: './profile-default-selector.component.html',
  styleUrl: './profile-default-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileDefaultSelectorComponent {
  #authStore = inject(AuthStore);
  #userStore = inject(UserStore);
  #platformId = inject(PLATFORM_ID);
  userPhoto = this.#userStore.photoUrl;
  username = this.#userStore.username;
  shouldShowProfileSelector = computed(
    () => !!this.#userStore.admin() || !!this.#userStore.barber()
  );
  isLoggedIn = computed(() => !!this.#authStore.token());
  #translocoService = inject(TranslocoService);

  #lang$ = this.#translocoService.langChanges$.pipe(
    startWith(
      isPlatformBrowser(this.#platformId)
        ? localStorage.getItem('language') || 'pt'
        : 'pt'
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  currentLang = toSignal(this.#lang$);
  currentProfile = input<string | undefined>('CLIENTE');
  changeViewEvent = output<IProfileContentView>();
  canBePartner = computed(() => {
    return !this.#userStore.admin() && !this.#userStore.barber();
  });
  readonly IProfileContentView = IProfileContentView;

  logout(): void {
    this.#authStore.logout();
  }
}
