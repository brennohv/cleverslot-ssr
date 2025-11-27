import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  AuthStore,
  IInputType,
  InputComponent,
  SpinnerComponent,
} from 'ba-ngrx-signal-based';

@Component({
  selector: 'app-reset-password-page',
  standalone: true,
  imports: [
    InputComponent,
    RouterLink,
    MatButtonModule,
    TranslocoPipe,
    TranslocoDirective,
    SpinnerComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './reset-password-page.component.html',
  styleUrl: './reset-password-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordPageComponent {
  readonly IInputType = IInputType;
  readonly I18N_PREFFIX = 'mfAuth.reset-password.';
  #authStore = inject(AuthStore);
  #route = inject(ActivatedRoute);

  resetForm = new FormGroup({
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  isLoading = this.#authStore.authLoading;
  resetParam = this.#route.snapshot.queryParamMap.get('code');

  resetPassword(): void {
    if (this.resetForm.valid && this.resetParam) {
      const { confirmPassword, password } = this.resetForm.getRawValue();

      this.#authStore.resetPassword({
        code: this.resetParam,
        password,
        passwordConfirmation: confirmPassword,
      });
    } else {
      this.markFormAsDirty();
    }
  }
  private markFormAsDirty(): void {
    this.resetForm.markAllAsTouched();
  }
}
