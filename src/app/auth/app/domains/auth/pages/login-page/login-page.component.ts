import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  InputComponent,
  AuthStore,
  SpinnerComponent,
  ICredentials,
  IInputType,
} from 'ba-ngrx-signal-based';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { first } from 'rxjs';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    InputComponent,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    SpinnerComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslocoPipe,
    TranslocoDirective,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  #route = inject(ActivatedRoute);
  #authStore = inject(AuthStore);
  redirectTo = signal<string | null>(null);
  isLoading = this.#authStore.authLoading;
  loginForm = new FormGroup({
    identifier: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  readonly IInputType = IInputType;

  constructor() {}

  ngOnInit(): void {
    this.getBarbershopSlugParam();
  }

  login(): void {
    if (this.loginForm.valid) {
      this.#authStore.loginMutation(
        this.loginForm.value as ICredentials,
        'login component',
        this.redirectTo()
      );
    }
  }

  getBarbershopSlugParam(): void {
    this.#route.queryParamMap.pipe(first()).subscribe((params) => {
      this.redirectTo.update(() => params.get('redirectTo'));
    });
  }
}
