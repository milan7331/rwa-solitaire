import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { catchError, debounceTime, distinctUntilChanged, map, Observable, of, switchMap, take } from "rxjs";
import { ASYNC_ERROR_RULE } from "./async-rules";


export function createAsyncAvailabilityValidator(
    serviceCall: (value: string) => Observable<Boolean>,
    errorKey: string
): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (control.errors && !control.errors[ASYNC_ERROR_RULE.errorKey]) return of(null);
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(500),
            distinctUntilChanged(),
            switchMap(value => serviceCall(value)),
            map(isAvailable => {
              return isAvailable ? null : { [errorKey]: true };
            }),
            catchError(() => of({ async: true })),
            take(1)
        );
    }
}