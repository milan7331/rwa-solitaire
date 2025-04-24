import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegexValidationRule } from '../../../models/validation/regex-rule';

export function createPatternValidator(rules: RegexValidationRule[]): ValidatorFn {
    return (control: AbstractControl) => {
        const value = control.value;
        if (value === undefined || value === null) return null;

        const errors: ValidationErrors = {};

        rules.forEach(rule => {
            if (rule.regex.test(value) === false) {
                errors[rule.errorKey] = { message: rule.message };
            }
        });

        return Object.keys(errors).length ? errors : null;
    }
}
