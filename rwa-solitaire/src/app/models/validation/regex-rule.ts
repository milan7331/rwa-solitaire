import { ValidationRule } from "./validation-rule";

export interface RegexValidationRule extends ValidationRule {
    regex: RegExp;
}