import { RegexValidationRule } from "../../../models/validation/regex-rule";

export const RULES_EDIT_EMAIL: RegexValidationRule[] = [
    {
        regex: /^(?!\s*$).+$/,
        errorKey: 'emailRequired',
        message: 'Email is required'
    },
    {
        regex: /^(?:.{0}|.{6,128})$/,
        errorKey: 'emailLength',
        message: 'Email must be between 6 and 128 characters',
    },
    {
        regex: /^(?:.{0}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
        errorKey: 'invalidEmailFormat',
        message: 'Please enter a valid email address'
    }
];

export const RULES_EDIT_PASSWORD: RegexValidationRule[] = [
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
];

export const RULES_EDIT_NEW_PASSWORD: RegexValidationRule[] = [
    {
        regex: /^(?!\s*$).+$/,
        errorKey: 'passwordRequired',
        message: 'Password is required',
    },
    {
        regex: /^(?:.{0}|.{8,64})$/,
        errorKey: 'passwordLength',
        message: 'Password must be between 8 and 64 characters',
    },
    {
        regex: /^(?:.{0}|(?=.*[A-Z]).+)$/,
        errorKey: 'missingUppercase',
        message: 'Password must contain at least 1 uppercase letter (A-Z)',
    },
    {
        regex: /^(?:.{0}|(?=.*[a-z]).+)$/,
        errorKey: 'missingLowercase',
        message: 'Password must contain at least 1 lowercase letter (a-z)',
    },
    {
        regex: /^(?:.{0}|(?=.*\d).+)$/,
        errorKey: 'missingNumber',
        message: 'Password must contain at least 1 number (0-9)',
    },
    {
        regex: /^(?:.{0}|(?=.*[!@#$%^&*(),.?":{}|<>]).+)$/,
        errorKey: 'missingSpecialChar',
        message: 'Password must contain at least 1 special character (!@#$%^&*(),.?":{}|<>)',
    },
];

export const RULES_EDIT_FIRSTNAME: RegexValidationRule[] = [
    {
        regex: /^(?:.{0}|.{2,64})$/,
        errorKey: 'firstnameLength',
        message: 'First name must be between 2 and 64 characters if provided',
    },
    {
        regex: /^(?:.{0}|[\p{L}\-'’\s]+)$/u,
        errorKey: 'invalidFirstNameFormat',
        message: 'First name can only contain letters, hyphens (-), apostrophes (\’), and spaces',
    }
];

export const RULES_EDIT_LASTNAME: RegexValidationRule[] = [
    {
        regex: /^(?:.{0}|.{2,64})$/,
        errorKey: 'lastnameLength',
        message: 'Last name must be between 2 and 64 characters if provided',
    },
    {
        regex: /^(?:.{0}|[\p{L}\-'’\s]+)$/u,
        errorKey: 'invalidLastNameFormat',
        message: 'Last name can only contain letters, hyphens (-), apostrophes (\’), and spaces',
    }
];