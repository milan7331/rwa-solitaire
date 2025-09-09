import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loginActions, logoutActions, registerActions, sessionActions } from "../actions/user.actions";
import { delay, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class NavigationEffects {
    private readonly actions$: Actions = inject(Actions);
    private readonly router: Router = inject(Router);

    navigateOnRegisterSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(registerActions.registerSuccess),
            delay(1200),
            tap(() => this.router.navigate(['/login']))
        ),
        { dispatch: false }
    );

    navigateOnValidateSessionSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sessionActions.validateSessionSuccess),
            tap(() => this.router.navigate(['/menu']))
        ),
        { dispatch: false }
    );

    navigateOnLoginSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.logInSuccess),
            tap(() => this.router.navigate(['/menu']))
        ),
        { dispatch: false }
    );

    navigateOnLogoutSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logoutActions.logoutSuccess),
            tap(() => this.router.navigate(['/home']))
        ),
        { dispatch: false }
    );
}