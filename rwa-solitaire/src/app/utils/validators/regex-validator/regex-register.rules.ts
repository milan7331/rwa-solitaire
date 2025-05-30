import { RegexValidationRule } from '../../../models/validation/regex-rule';

export const RULES_REGISTER_EMAIL: RegexValidationRule[] = [
    {
        regex: /^(?!\s*$).+$/,
        errorKey: 'emailRequired',
        message: 'Email is required'
    },
    {
        regex: /^.{6,}$/,
        errorKey: 'emailMinLength',
        message: 'Email must be at least 6 characters long',
    },
    {
        regex: /^.{0,128}$/,
        errorKey: 'emailMaxLength',
        message: 'Email cannot exceed 128 characters',
    },
    {
        regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        errorKey: 'invalidEmailFormat',
        message: 'Please enter a valid email address'
    }

];

export const RULES_REGISTER_USERNAME: RegexValidationRule[] = [
    {
        regex: /^(?!\s*$).+$/,
        errorKey: 'usernameRequired',
        message: 'Username is required',
    },
    {
        regex: /^.{6,}$/,
        errorKey: 'usernameMinLength',
        message: 'Username must be at least 6 characters long',
    },
    {
        regex: /^.{0,32}$/,
        errorKey: 'usernameMaxLength',
        message: 'Username cannot exceed 32 characters',
    },
    {
        regex: /^[a-zA-Z0-9_]+$/,
        errorKey: 'invalidUsernameFormat',
        message: 'Username can contain only letters numbers and underscores',
    },
];

export const RULES_REGISTER_PASSWORD: RegexValidationRule[] = [
    {
        regex: /^(?!\s*$).+$/,
        errorKey: 'passwordRequired',
        message: 'Password is required',
    },
    {
        regex: /^.{8,}$/,
        errorKey: 'passwordMinLength',
        message: 'Password must be at least 8 characters long',
    },
    {
        regex: /^.{0,64}$/,
        errorKey: 'passwordMaxLength',
        message: 'Password cannot exceed 64 characters',
    },
    {
        regex: /[A-Z]/,
        errorKey: 'missingUppercase',
        message: 'Password must contain at least 1 uppercase letter (A-Z)',
    },
    {
        regex: /[a-z]/,
        errorKey: 'missingLowercase',
        message: 'Password must contain at least 1 lowercase letter (a-z)',
    },
    {
        regex: /\d/,
        errorKey: 'missingNumber',
        message: 'Password must contain at least 1 number (0-9)',
    },
    {
        regex: /[!@#$%^&*(),.?":]/,
        errorKey: 'missingSpecialChar',
        message: 'Password must contain at least 1 special character (!@#$%^&*(),.?":)',
    },
];


export const RULES_REGISTER_FIRSTNAME: RegexValidationRule[] = [
    {
        regex: /^(?!\s*$).+$/,
        errorKey: 'firstnameRequired',
        message: 'First name is required',
    },
    {
        regex: /^.{2,}$/,
        errorKey: 'firstnameMinLength',
        message: 'First name must be at least 2 characters long',
    },
    {
        regex: /^.{0,64}$/,
        errorKey: 'firstnameMaxLength',
        message: 'First name cannot exceed 64 characters',
    },
    {
        regex: /^[\p{L}\-'’\s]+$/u,
        errorKey: 'invalidFirstNameFormat',
        message: 'Furst name can only contain letters, hyphens (-), apostrophes (\’), and spaces',
    }
];

export const RULES_REGISTER_LASTNAME: RegexValidationRule[] = [
    {
        regex: /^(?!\s*$).+$/,
        errorKey: 'lastnameRequired',
        message: 'First name is required',
    },
    {
        regex: /^.{2,}$/,
        errorKey: 'lastnameMinLength',
        message: 'Last name must be at least 2 characters long',
    },
    {
        regex: /^.{0,64}$/,
        errorKey: 'lastnameMaxLength',
        message: 'Last name cannot exceed 64 characters',
    },
    {
        regex: /^[\p{L}\-'’\s]+$/u,
        errorKey: 'invalidLastNameFormat',
        message: 'Last name can only contain letters, hyphens (-), apostrophes (\’), and spaces',
    }
];
