import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from '../actions/auth.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { AuthService } from '../../services/api/auth/auth.service';

export class AuthEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly authService: AuthService,
    ) {}

    login$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.logIn),
            exhaustMap((action) => {
                return this.authService.login(action.username, action.password).pipe(
                    map(response => {
                        if (response) return AuthActions.logInSuccess();
                        return AuthActions.logInFailure({ message: 'Login failed!'});
                    }),
                    catchError(error => of(AuthActions.logInFailure({ message: error.message })))
                );
            })
        );
    });

    logout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.logout),
            exhaustMap(() => {
                return this.authService.logout().pipe(
                    map(response => {
                        if (response) return AuthActions.logoutSuccess();
                        return AuthActions.logoutFailure({ message: 'Logout failed!' });
                    }),
                    catchError(error => of(AuthActions.logoutFailure({ message: error.message })))
                );
            })
        );
    });

    validateSession$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.validateSession),
            exhaustMap(() => {
                return this.authService.validateSession().pipe(
                    map(response => {
                        if (response) return AuthActions.logInSuccess();
                        console.log('Session not valid!');
                        return AuthActions.logout(); // jwt cleanup
                    })
                )
            })
        )
    })
}