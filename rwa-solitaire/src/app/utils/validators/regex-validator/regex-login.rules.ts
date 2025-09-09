import { RegexValidationRule } from "../../../models/validation/regex-rule";

export const RULES_LOGIN_USERNAME: RegexValidationRule[] = [
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

export const RULES_LOGIN_PASSWORD: RegexValidationRule[] = [
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
