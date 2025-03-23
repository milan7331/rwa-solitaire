import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, EMPTY, exhaustMap, map, of, tap, withLatestFrom } from 'rxjs';

import { AuthService } from '../../services/api/auth/auth.service';
import { LocalStorageService } from '../../services/app/local-storage/local-storage.service';
import { inject, Injectable } from '@angular/core';
import { loginActions, logoutActions, sessionActions } from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
    private readonly actions$: Actions = inject(Actions);
    private readonly authService: AuthService = inject(AuthService);
    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.logIn),
            exhaustMap((action) =>
                this.authService.login(action.username, action.password).pipe(
                    map(() => loginActions.logInSuccess({ username: action.username })),
                    catchError(error => {
                        console.error(error);
                        return of(logoutActions.logout());
                    }),
                )
            )
        )
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logoutActions.logout),
            exhaustMap(() =>
                this.authService.logout().pipe(
                    map(() => logoutActions.logoutSuccess()),
                    catchError(error => {
                        console.error(error);
                        return EMPTY;
                    }),
                )
            )
        )
    );

    handleLoginSuccess$ = createEffect(() => 
        this.actions$.pipe(
            ofType(loginActions.logInSuccess),
            tap((action) => this.localStorageService.setUsername(action.username)),
        ),
        { dispatch: false }
    );

    handleLogoutSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logoutActions.logoutSuccess),
            tap(() => this.localStorageService.removeUsername())
        ),
        { dispatch: false }
    );

    validateSession$ = createEffect(() => 
        this.actions$.pipe(
            ofType(sessionActions.validateSession),
            map(() => this.localStorageService.getUsername() ?? ''),
            exhaustMap((username) => 
                this.authService.validateSession(username).pipe(
                    map(() => sessionActions.validateSessionSuccess({ username })),
                    catchError((error) => {
                        console.error(error);
                        return of(logoutActions.logout());
                    })
                )
            )
        )
    );
}
