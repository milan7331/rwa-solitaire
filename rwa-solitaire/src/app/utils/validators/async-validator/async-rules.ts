import { AsyncValidationRule } from "../../../models/validation/async-validation-rule";

export const ASYNC_USERNAME_RULE: AsyncValidationRule = {
  errorKey: 'usernameNotAvailable',
  message: 'Username is already taken.'
};

export const ASYNC_EMAIL_RULE: AsyncValidationRule = {
  errorKey: 'emailNotAvailable',
  message: 'Email is already registered.'
};

export const ASYNC_ERROR_RULE: AsyncValidationRule = {
    errorKey: 'async',
    message: 'Error checking availability. Please check your connection.'
};