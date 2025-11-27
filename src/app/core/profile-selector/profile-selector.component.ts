import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import { IProfileContentView } from '../types/profile-content-view.model';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import { UserType } from '../types/user-type.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { IBarberAndAdminSoft, UserStore } from 'ba-ngrx-signal-based';

@Component({
  selector: 'app-profile-selector',
  standalone: true,
  imports: [MatIcon, TranslocoPipe,
    TranslocoDirective, RouterLink],
  templateUrl: './profile-selector.component.html',
  styleUrl: './profile-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSelectorComponent {
  #route = inject(ActivatedRoute);
  #userStore = inject(UserStore);
  barber = this.#userStore.barber;
  admin = this.#userStore.admin;
  changeViewEvent = output<IProfileContentView>();
  closeModalEvent = output<boolean>();
  readonly IProfileContentView = IProfileContentView;
  currentProfile$: Observable<UserType> = this.#route.data.pipe(
    map((data) => data['userType'])
  );

  currentProfile = toSignal<UserType>(this.currentProfile$);
  readonly UserType = UserType;
}
