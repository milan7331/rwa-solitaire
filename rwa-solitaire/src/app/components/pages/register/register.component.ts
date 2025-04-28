import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { createPatternValidator } from '../../../utils/validators/regex-validator/regex.factory';
import { RegexValidationRule } from '../../../models/validation/regex-rule';
import { RULES_REGISTER_EMAIL, RULES_REGISTER_FIRSTNAME, RULES_REGISTER_LASTNAME, RULES_REGISTER_PASSWORD, RULES_REGISTER_USERNAME } from '../../../utils/validators/regex-validator/regex-register.rules';
import { AudioService } from '../../../services/app/audio/audio.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true
})
export class RegisterComponent {
  showPassword: boolean;
  showErrors: boolean;
  showLoading: boolean;

  registerForm: FormGroup;

  get email() { return this.registerForm.get('email'); }
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly audio: AudioService,
  ) {
    this.showPassword = false;
    this.showErrors = false;
    this.showLoading = false;

    this.registerForm = this.formBuilder.group({
      email: ['', [createPatternValidator(RULES_REGISTER_EMAIL)], []],
      username: ['', [createPatternValidator(RULES_REGISTER_USERNAME)], []],
      password: ['', [createPatternValidator(RULES_REGISTER_PASSWORD)], []],
      firstName: ['', [createPatternValidator(RULES_REGISTER_FIRSTNAME)], []],
      lastName: ['', [createPatternValidator(RULES_REGISTER_LASTNAME)], []],
    });
  }

  onSubmit(): void {
    this.audio.play_buttonPress();
    this.registerForm.markAsTouched();

    if (this.registerForm.invalid) {
      this.showErrors = true;
      return;
    }

    setTimeout(() => {
      this.loadingEnd();
    }, 5000);
  }

  loadingEnd(): void {
    this.showLoading = true;
  }

  togglePasswordVisibility = () => {
    this.audio.play_buttonPress();
    this.showPassword = !this.showPassword;
  }

  getErrorMessage(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';
    
    const firstError: RegexValidationRule | null | undefined = Object.values(errors)[0];
    return firstError?.message ?? 'Invalid input';
  }
  
}
