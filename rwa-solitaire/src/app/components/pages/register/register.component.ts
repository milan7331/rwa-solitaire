import { Component, DestroyRef, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map, Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { createPatternValidator } from '../../../utils/validators/regex-validator/regex.factory';
import { RegexValidationRule } from '../../../models/validation/regex-rule';
import { RULES_REGISTER_EMAIL, RULES_REGISTER_FIRSTNAME, RULES_REGISTER_LASTNAME, RULES_REGISTER_PASSWORD, RULES_REGISTER_USERNAME } from '../../../utils/validators/regex-validator/regex-register.rules';

import { UsernameAsyncValidator } from '../../../utils/validators/async-validator/async-username';
import { EmailAsyncValidator } from '../../../utils/validators/async-validator/async-email';

import { AudioService } from '../../../services/app/audio/audio.service';
import { registerActions } from '../../../store/actions/user.actions';
import { selectRegisterErrorMessage, selectRegisterLoading, selectRegisterValid } from '../../../store/selectors/user.selectors';
import { AsyncValidationRule } from '../../../models/validation/async-validation-rule';

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
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true
})
export class RegisterComponent implements OnInit {
  showPassword: boolean;
  showErrors: boolean;

  registerForm: FormGroup;

  showLoading$: Observable<boolean>;
  registerValid$: Observable<boolean>;
  errorMessage$: Observable<string>;
  isCheckingUsername$: Observable<boolean>;
  isCheckingEmail$: Observable<boolean>;



  get email() { return this.registerForm.get('email'); }
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get firstname() { return this.registerForm.get('firstName'); }
  get lastname() { return this.registerForm.get('lastName'); }

  constructor(
    private readonly store: Store,
    private readonly audio: AudioService,
    private readonly formBuilder: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly destroyRef: DestroyRef,
    private readonly usernameAsyncValidator: UsernameAsyncValidator,
    private readonly emailAsyncValidator: EmailAsyncValidator,
  ) {
    this.showPassword = false;
    this.showErrors = false;
    this.showLoading$ = of(false);
    this.registerValid$ = of(false);
    this.errorMessage$ = of('');
    this.isCheckingUsername$ = of(false);
    this.isCheckingEmail$ = of(false);

    // async validation rules dont run if there are regular validation errors present!
    this.registerForm = this.formBuilder.group({
      email: ['', [createPatternValidator(RULES_REGISTER_EMAIL)], [this.emailAsyncValidator.validate.bind(this.emailAsyncValidator)]],
      username: ['', [createPatternValidator(RULES_REGISTER_USERNAME)], [this.usernameAsyncValidator.validate.bind(this.usernameAsyncValidator)]],
      password: ['', [createPatternValidator(RULES_REGISTER_PASSWORD)], []],
      firstname: ['', [createPatternValidator(RULES_REGISTER_FIRSTNAME)], []],
      lastname: ['', [createPatternValidator(RULES_REGISTER_LASTNAME)], []],
    });
  }

  ngOnInit(): void {
    this.store.select(selectRegisterValid).pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(registerValid => registerValid)
    ).subscribe(() => {
      this.snackbar.open('Account registered successfully!', '', {
        duration: 1000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.store.dispatch(registerActions.clearRegisterValid());
    });

    this.showLoading$ = this.store.select(selectRegisterLoading);
    this.errorMessage$ = this.store.select(selectRegisterErrorMessage);

    this.isCheckingUsername$ = this.username?.statusChanges.pipe(
      map(status => status === 'PENDING')
    ) || of(false);

    this.isCheckingEmail$ = this.email?.statusChanges.pipe(
      map(status => status === 'PENDING')
    ) || of(false);

    this.errorMessage$.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter((msg): msg is string => msg !== null && msg !== undefined && msg.length > 0)
    ).subscribe((msg) => {
      this.snackbar.open(msg, 'Okay', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      this.store.dispatch(registerActions.registerClearError());
    });
  }

  onSubmit(): void {
    this.audio.play_buttonPress();
    this.registerForm.markAsTouched();

    if (this.registerForm.invalid) {
      this.showErrors = true;
      return;
    }

    const formData = this.registerForm.getRawValue();
    const userData: any = {};
    userData.email = formData.email;
    userData.username = formData.username;
    userData.password = formData.password;
    if (formData.firstname) userData.firstname = formData.firstname;
    if (formData.lastname) userData.lastname = formData.lastname;

    this.store.dispatch(registerActions.register(userData));
  }

  togglePasswordVisibility = () => {
    this.audio.play_buttonPress();
    this.showPassword = !this.showPassword;
  }

  getErrorMessage(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';

    const firstError: RegexValidationRule | AsyncValidationRule | null | undefined = Object.values(errors)[0];
    return firstError?.message ?? 'Invalid input';
  }
}
