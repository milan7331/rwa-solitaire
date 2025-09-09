import { Component, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createPatternValidator } from '../../../utils/validators/regex-validator/regex.factory';
import { RULES_LOGIN_PASSWORD, RULES_LOGIN_USERNAME } from '../../../utils/validators/regex-validator/regex-login.rules';
import { RegexValidationRule } from '../../../models/validation/regex-rule';
import { MatDividerModule } from '@angular/material/divider';
import { AudioService } from '../../../services/app/audio/audio.service';
import { filter, Observable, of } from 'rxjs';
import { loginActions } from '../../../store/actions/user.actions';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { selectLoginErrorMessage, selectLoginLoading } from '../../../store/selectors/user.selectors';

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
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent implements OnInit {
  showPassword: boolean;
  showErrors: boolean;

  loginForm: FormGroup;

  showLoading$: Observable<boolean>;
  errorMessage$: Observable<string>;

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly audio: AudioService,
    private readonly store: Store,
    private readonly destroyRef: DestroyRef,
    private readonly snackbar: MatSnackBar,
  ) {
    this.showPassword = false;
    this.showErrors = false;

    this.showLoading$ = of(false);
    this.errorMessage$ = of('');

    this.loginForm = this.formBuilder.group({
      username: ['', [createPatternValidator(RULES_LOGIN_USERNAME)], []],
      password: ['', [createPatternValidator(RULES_LOGIN_PASSWORD)], []],
    });
  }

  ngOnInit(): void {
    this.showLoading$ = this.store.select(selectLoginLoading);
    this.errorMessage$ = this.store.select(selectLoginErrorMessage);

    this.errorMessage$.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((msg): msg is string => msg !== null && msg !== undefined && msg.length > 0)
    ).subscribe((msg) => {
      this.snackbar.open(msg, 'Okay', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    })
  }

  onSubmit(): void {
    this.audio.play_buttonPress();
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      this.showErrors = true;
      return;
    }

    const formData = this.loginForm.getRawValue();
    const loginData: any = {};
    loginData.username = formData.username;
    loginData.password = formData.password;

    this.store.dispatch(loginActions.logIn(loginData));
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
