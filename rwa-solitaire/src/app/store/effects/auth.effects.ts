import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthActions } from '../actions/auth.actions';
import { catchError, exhaustMap, map, of } from 'rxjs';

import { AuthService } from '../../services/api/auth/auth.service';
import { LocalStorageService } from '../../services/app/local-storage/local-storage.service';

export class AuthEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly authService: AuthService,
        private readonly localStorageService: LocalStorageService,
    ) {}

    // login$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(AuthActions.logIn),
    //         exhaustMap((action) => {
    //             return this.authService.login(action.username, action.password).pipe(
    //                 map(() => {
    //                     this.localStorageService.setUsername(action.username);
    //                     return AuthActions.logInSuccess({ username: action.username });
    //                 }),
    //                 catchError((error) => {
    //                     console.error(error.message);
    //                     return of(AuthActions.logInFailure());
    //                 }),
    //             );
    //         })
    //     );
    // });

    // logout$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(AuthActions.logout),
    //         exhaustMap(() => {
    //             return this.authService.logout().pipe(
    //                 map(() => {
    //                     this.localStorageService.removeUsername();
    //                     return AuthActions.logoutSuccess()
    //                 }),
    //                 catchError(error => {
    //                     console.error(error.message);
    //                     return of(AuthActions.logoutFailure());
    //                 }),
    //             );
    //         })
    //     );
    // });


    // // VALIDATE SESSION TREBA DA SE POKREĆE SVAKI PUT KAD UČITAMO APP, TREBA NAM username negde sačuvan da bi imalo smisla
    // validateSession$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(AuthActions.validateSession),
    //         exhaustMap(() => {
    //             return this.authService.validateSession().pipe(
    //                 map(() => {
    //                     const username = this.localStorageService.getUsername();
    //                     if (!username) return AuthActions.logout();
    //                     return AuthActions.validateSessionSuccess({ username: username });
    //                 }),
    //                 catchError(error => {
    //                     console.error(error.message);
    //                     return of(AuthActions.logout());
    //                 })
    //             )
    //         })
    //     )
    // })
}
