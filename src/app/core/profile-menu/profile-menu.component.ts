import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import {
  AuthStore,
  ClickOutsideDirective,
  GetImgUrlPipe,
  UserStore,
} from 'ba-ngrx-signal-based';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoDirective } from '@jsverse/transloco';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import {
  BehaviorSubject,
  distinctUntilChanged,
  filter,
  map,
  tap,
  Observable,
} from 'rxjs';
import { IProfileContentView } from '../types/profile-content-view.model';
import { ProfileLanguageSelectorComponent } from '../profile-language-selector/profile-language-selector.component';
import { ProfileDefaultSelectorComponent } from '../profile-default-selector/profile-default-selector.component';
import { ProfileSelectorComponent } from '../profile-selector/profile-selector.component';
import { UserType } from '../types/user-type.model';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ClickOutsideDirective,
    TranslocoDirective,
    MatIcon,
    ProfileLanguageSelectorComponent,
    ProfileDefaultSelectorComponent,
    ProfileSelectorComponent,
    GetImgUrlPipe,
  ],
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent {
  #authStore = inject(AuthStore);
  #userStore = inject(UserStore);
  #cdr = inject(ChangeDetectorRef);
  #platformId = inject(PLATFORM_ID);
  #route = inject(ActivatedRoute);

  #contentHeightObserver = isPlatformBrowser(this.#platformId)
    ? new ResizeObserver((entries) => {
        this.#contentHeightSubject.next(
          entries[0].borderBoxSize[0].blockSize + 'px'
        );
      })
    : null;

  #contentHeightSubject = new BehaviorSubject('auto');

  contentHeight$ = this.#contentHeightSubject.asObservable().pipe(
    filter((value) => value !== '0px'),
    distinctUntilChanged(),
    tap(() => {
      queueMicrotask(() => {
        this.#cdr.detectChanges();
      });
    })
  );
  username = this.#userStore.username;
  userPhoto = this.#userStore.photoUrl;
  isLoggedIn = computed(() => !!this.#authStore.token());
  isOpenMenu = signal(false);
  contentView = signal<IProfileContentView>(IProfileContentView.DEFAULT);
  currentProfile$: Observable<string> = this.#route.data.pipe(
    map((data) => data['userType']),
    map((currentProfile) => {
      if (currentProfile === UserType.ADMIN) {
        return 'ADMIN';
      }
      if (currentProfile === UserType.PROFESSIONAL) {
        return 'BARBER';
      }

      return 'CLIENT';
    })
  );

  currentProfile = toSignal(this.currentProfile$);

  containerResize =
    viewChild.required<ElementRef<HTMLElement>>('containerResize');
  readonly IProfileContentView = IProfileContentView;

  toggleMenu(): void {
    this.isOpenMenu.update((value) => !value);

    if (this.isOpenMenu()) {
      this.#cdr.detectChanges();
      if (isPlatformBrowser(this.#platformId)) {
        this.#contentHeightObserver?.observe(
          this.containerResize().nativeElement
        );
      }
    } else {
      if (isPlatformBrowser(this.#platformId)) {
        this.#contentHeightObserver?.disconnect();
      }
    }
  }

  closeMenu(): void {
    this.changeView(IProfileContentView.DEFAULT);
    this.isOpenMenu.set(false);
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  changeView(view: IProfileContentView): void {
    this.contentView.update(() => view);
  }
}
