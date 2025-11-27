import {
  Component,
  DestroyRef,
  OnInit,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  InputPhone,
  InputComponent,
  TelephoneInputComponent,
  AuthStore,
  FormErrorEnum,
  IInputType,
  SpinnerComponent,
} from 'ba-ngrx-signal-based';
import { Observable, combineLatest, first, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    InputComponent,
    TelephoneInputComponent,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    TranslocoPipe,
    TranslocoDirective,
    SpinnerComponent,
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent implements OnInit {
  #authStore = inject(AuthStore);
  #destroyRef = inject(DestroyRef);
  #route = inject(ActivatedRoute);

  registerForm = this.fb.group({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    telephone: new FormControl<InputPhone>(
      { countryCode: '', dialCode: '', internationalNumber: '', number: '' },
      {
        nonNullable: true,
        validators: Validators.required,
      }
    ),
  });

  isLoading = this.#authStore.authLoading;
  redirectTo?: string | null;
  readonly IInputType = IInputType;

  constructor(private fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.passwordEqualitySetup().subscribe();
    this.getBarbershopSlugParam();
  }

  register(): void {
    if (this.registerForm.valid) {
      const { email, password, telephone, username } =
        this.registerForm.getRawValue();

      this.#authStore.register(
        {
          email,
          password,
          telephone: telephone as InputPhone,
          username,
        },
        'Register component',
        true,
        this.redirectTo
      );
    } else {
      this.markFormAsDirty();
    }
  }

  private markFormAsDirty(): void {
    this.registerForm.markAllAsTouched();
  }

  passwordEqualitySetup(): Observable<{
    confirmPassword: string | null;
    passwordChange: string | null;
  }> {
    const passwordChange = this.registerForm.controls.password.valueChanges;
    const confirmPassword =
      this.registerForm.controls.confirmPassword.valueChanges;
    return combineLatest({
      confirmPassword,
      passwordChange,
    }).pipe(
      takeUntilDestroyed(this.#destroyRef),
      tap(({ confirmPassword, passwordChange }) => {
        if (passwordChange !== confirmPassword) {
          this.registerForm.controls.confirmPassword.setErrors({
            [FormErrorEnum.PASSWORDS_EQUALITY]: true,
          });
        } else {
          this.registerForm.controls.confirmPassword.setErrors(null);
        }
      })
    );
  }

  getBarbershopSlugParam(): void {
    this.#route.queryParamMap.pipe(first()).subscribe((params) => {
      this.redirectTo = params.get('redirectTo');
    });
  }
}
