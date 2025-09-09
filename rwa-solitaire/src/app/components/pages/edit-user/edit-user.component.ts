import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { filter, map, Observable, of } from 'rxjs';
import { AudioService } from '../../../services/app/audio/audio.service';
import { Store } from '@ngrx/store';
import { EmailAsyncValidator } from '../../../utils/validators/async-validator/async-email';
import { createPatternValidator } from '../../../utils/validators/regex-validator/regex.factory';
import { RegexValidationRule } from '../../../models/validation/regex-rule';
import { AsyncValidationRule } from '../../../models/validation/async-validation-rule';
import { selectEditUserLoading, selectEditUserMessage, selectEditValid, selectUser } from '../../../store/selectors/user.selectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { editUserActions } from '../../../store/actions/user.actions';
import { User } from '../../../models/user/user';
import { MatDividerModule } from '@angular/material/divider';
import { RULES_EDIT_EMAIL, RULES_EDIT_FIRSTNAME, RULES_EDIT_LASTNAME, RULES_EDIT_NEW_PASSWORD, RULES_EDIT_PASSWORD } from '../../../utils/validators/regex-validator/regex-edit.rules';

@Component({
  selector: 'app-edit-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss',
  standalone: true
})

export class EditUserComponent implements OnInit {
  showPassword: boolean;
  showNewPassword: boolean;
  showErrors: boolean;

  user$: Observable<User>
  showLoading$: Observable<boolean>;
  editUserValid$: Observable<boolean>;
  errorMessage$: Observable<string>;
  isCheckingEmail$: Observable<boolean>;

  initialData: User;
  editForm: FormGroup;

  get email() { return this.editForm.get('email') };
  get newPassword() { return this.editForm.get('newPassword') };
  get firstname() { return this.editForm.get('firstname') };
  get lastname() { return this.editForm.get('lastname') };
  get password() { return this.editForm.get('password') };

  constructor(
    private readonly store: Store,
    private readonly audio: AudioService,
    private readonly formBuilder: FormBuilder,
    private readonly snackbar: MatSnackBar,
    private readonly destroyRef: DestroyRef,
    private readonly emailAsyncValidator: EmailAsyncValidator
  ) {
    this.showPassword = false;
    this.showNewPassword = false;
    this.showErrors = false;
    this.user$ = of({} as User);
    this.showLoading$ = of(false);
    this.editUserValid$ = of(false);
    this.errorMessage$ = of('');
    this.isCheckingEmail$ = of(false);

    this.initialData = {} as User;

    // async validation rules dont run if there are regular validation errors present!
    this.editForm = this.formBuilder.group({
      email: ['', [createPatternValidator(RULES_EDIT_EMAIL)], [this.emailAsyncValidator.validate.bind(this.emailAsyncValidator)]],
      newPassword: ['', [createPatternValidator(RULES_EDIT_NEW_PASSWORD)],[]],
      firstname: ['', [createPatternValidator(RULES_EDIT_FIRSTNAME)], []],
      lastname: ['', [createPatternValidator(RULES_EDIT_LASTNAME)], []],
      password: ['', [createPatternValidator(RULES_EDIT_PASSWORD)], []],
    });
  }

  ngOnInit(): void {
    this.store.select(selectEditValid).pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(editValid => editValid)
    ).subscribe(() => {
      this.snackbar.open('User data edited successfully!', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this.store.dispatch(editUserActions.clearEditValid());
    });

    this.showLoading$ = this.store.select(selectEditUserLoading);
    this.errorMessage$ = this.store.select(selectEditUserMessage);
    this.user$ = this.store.select(selectUser);

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
      this.store.dispatch(editUserActions.editUserClearError());
    });

    this.user$.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(user => !!user && Object.keys(user).length > 0)
    ).subscribe(user => {
      this.initialData = user;
      this.#populateForm(user);
    })
  }

  onSubmit(): void {
    this.audio.play_buttonPress();
    this.editForm.markAsTouched();

    if (this.editForm.invalid) {
      this.showErrors = true;
      return;
    }

    const formData = this.editForm.getRawValue();
    const data: any = {};
    if (formData.email) data.email = formData.email;
    if (formData.newPassword) data.newPassword = formData.newPassword;
    if (this.initialData.firstname !== formData.firstname) data.firstname = formData.firstname;
    if (this.initialData.lastname !== formData.lastname) data.lastname = formData.lastname;
    data.password = formData.password;

    this.store.dispatch(editUserActions.editUser(data));
  }

  togglePasswordVisibility = () => {
    this.audio.play_buttonPress();
    this.showPassword = !this.showPassword;
  }

  toggleNewPasswordVisibility = () => {
    this.audio.play_buttonPress();
    this.showNewPassword = !this.showNewPassword;
  }

  getErrorMessage(errors: ValidationErrors | null | undefined): string {
    if (!errors) return '';

    const firstError: RegexValidationRule | AsyncValidationRule | null | undefined = Object.values(errors)[0];
    return firstError?.message ?? 'Invalid input';
  }

  #populateForm(user: User): void {
    this.editForm.patchValue({
      email: '',
      newPassword: '',
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      password: '',
    }, { emitEvent: false });
  }
}