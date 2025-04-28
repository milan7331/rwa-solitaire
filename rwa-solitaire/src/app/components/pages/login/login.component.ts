import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createPatternValidator } from '../../../utils/validators/regex-validator/regex.factory';
import { LOGIN_RULES_PASSWORD, LOGIN_RULES_USERNAME } from '../../../utils/validators/regex-validator/regex-login.rules';
import { RegexValidationRule } from '../../../models/validation/regex-rule';
import { MatDividerModule } from '@angular/material/divider';
import { AudioService } from '../../../services/app/audio/audio.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent {
  showPassword: boolean;
  showErrors: boolean;
  showLoading: boolean;
  
  loginForm: FormGroup;

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly audio: AudioService,
  ) {
    this.showPassword = false;
    this.showErrors = false;
    this.showLoading = false;

    this.loginForm = this.formBuilder.group({
      username: ['', [createPatternValidator(LOGIN_RULES_USERNAME)], []],
      password: ['', [createPatternValidator(LOGIN_RULES_PASSWORD)], []],
    });
  }

  onSubmit(): void {
    this.audio.play_buttonPress();
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.showErrors = true;
      return;
    }

    this.showErrors = false;
    this.showLoading = true;

    setTimeout(() => {
      this.loadingEnd();
    }, 5000);

    //const { username, password } = this.loginForm.value;
    //console.log('Login atempted with: ', { username, password });
  }

  loadingEnd(): void {
    this.showLoading = false;
  }

  togglePasswordVisibility = () => {
    this.audio.play_buttonPress();
    this.showPassword = !this.showPassword;
  }

  // returns the first error message
  getErrorMessage(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';

    const firstError: RegexValidationRule | null | undefined = Object.values(errors)[0];
    return firstError?.message ?? 'Invalid input';
  }
}
