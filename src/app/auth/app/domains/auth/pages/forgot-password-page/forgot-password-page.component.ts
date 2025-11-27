import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoDirective } from '@jsverse/transloco';
import {
  AuthStore,
  IInputType,
  InputComponent,
  SpinnerComponent,
} from 'ba-ngrx-signal-based';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [
    TranslocoPipe,
    TranslocoDirective,
    InputComponent,
    SpinnerComponent,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './forgot-password-page.component.html',
  styleUrl: './forgot-password-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPageComponent {
  readonly I18N_PREFFIX = 'mfAuth.forgot-password.';
  #authStore = inject(AuthStore);
  isLoading = this.#authStore.authLoading;
  readonly IInputType = IInputType;
  emailFormControl = new FormControl<string>('', {
    validators: Validators.required,
  });

  forgotPassword(): void {
    if (this.emailFormControl.valid) {
      this.#authStore.forgotPassword(this.emailFormControl.value!);
    }
  }
}
