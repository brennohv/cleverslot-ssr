import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  FormErrorEnum,
  IInputType,
  InputComponent,
  InputPhone,
  SpinnerComponent,
  TelephoneInputComponent,
  UserStore,
} from 'ba-ngrx-signal-based';
import { LandingPageStore } from '@admin/landing-page/data/stores';
import { MatDivider } from '@angular/material/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    InputComponent,
    TelephoneInputComponent,
    ReactiveFormsModule,
    MatButtonModule,
    TranslocoPipe,
    TranslocoDirective,
    SpinnerComponent,
    MatDivider,
    MatIcon,
  ],
  providers: [LandingPageStore],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent implements OnInit {
  readonly IInputType = IInputType;
  readonly I18N_PREFFIX = 'mfAdmin.landing-page.';
  #userStore = inject(UserStore);
  #router = inject(Router);
  #landingPageStore = inject(LandingPageStore);
  #destroyRef = inject(DestroyRef);
  #dialog = inject(MatDialog);

  isLoggedIn = computed(() => !!this.#userStore?.documentId());
  canBePartner = computed(() => {
    return !this.#userStore?.admin() && !this.#userStore?.barber();
  });

  hasCreatedBarbershop = this.#landingPageStore.hasCreatedBarbershop;

  isLoading = this.#landingPageStore.loading;

  registerForm = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    estabilishmentName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
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

  ngOnInit(): void {
    this.#landingPageStore.setFormRx(this.registerForm.valueChanges);
    this.passwordEqualitySetup().subscribe();
  }

  scrollToElement(el: HTMLElement): void {
    el.scrollIntoView();
  }

  registerWithEstablishmentSetup() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.#landingPageStore
      .registerAndCreateEstabilishment()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (resp) => {
          if (!resp.error) {
            this.#router.navigate([
              '/',
              this.#userStore.admin().barbershopSlug,
              'admin',
              'subscription',
            ]);
          }
        },
      });
  }

  private passwordEqualitySetup(): Observable<{
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
}
