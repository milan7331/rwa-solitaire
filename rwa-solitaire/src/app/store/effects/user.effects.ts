import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/api/user/user.service";
import { Store } from "@ngrx/store";
import { catchError, map, switchMap, throttleTime, of, exhaustMap, tap, filter, withLatestFrom } from "rxjs";
import { loginActions, logoutActions, userDataActions, userStatsActions, registerActions, sessionActions, editUserActions } from "../actions/user.actions";
import { inject, Injectable } from "@angular/core";
import { AuthService } from "../../services/api/auth/auth.service";
import { LocalStorageService } from "../../services/app/local-storage/local-storage.service";
import { HttpErrorResponse } from "@angular/common/http";
import { selectLoginValid, selectUsername } from "../selectors/user.selectors";

@Injectable({
    providedIn: 'root'
})
export class UserEffects {
    private readonly actions$: Actions = inject(Actions);
    private readonly userService: UserService = inject(UserService);
    private readonly authService: AuthService = inject(AuthService);
    private readonly localStorageService: LocalStorageService = inject(LocalStorageService);
    private readonly store: Store = inject(Store);

    register$ = createEffect(() =>
        this.actions$.pipe(
            ofType(registerActions.register),
            exhaustMap((action) =>
                this.userService.register(
                    action.email,
                    action.username,
                    action.password,
                    action.firstname,
                    action.lastname
                ).pipe(
                    map(() => registerActions.registerSuccess()),
                    catchError((e: HttpErrorResponse) => {
                        const message = e.error?.message || e.message || 'An unknown registration error has occured!';
                        return of(registerActions.registerFailure({ message }));
                    })
                )
            )
        )
    );

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.logIn),
            exhaustMap((action) =>
                this.authService.login(action.username, action.password).pipe(
                    map(() => loginActions.logInSuccess({ username: action.username })),
                    catchError(e => {
                        const message = e.error?.message || e.message || 'An unknown login error has occured!';
                        return of(loginActions.logInFailure({ message }));
                    })
                )
            )
        )
    );

    loginSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loginActions.logInSuccess),
            tap((action) => this.localStorageService.setUsername(action.username)),
        ),
        { dispatch: false }
    );

    logout$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logoutActions.logout),
            exhaustMap(() =>
                this.authService.logout().pipe(
                    map(() => logoutActions.logoutSuccess()),
                    catchError(() => of(logoutActions.logoutSuccess())),
                )
            )
        )
    );

    logoutSuccess$ = createEffect(() =>
        this.actions$.pipe(
            ofType(logoutActions.logoutSuccess),
            tap(() => this.localStorageService.removeUsername())
        ),
        { dispatch: false }
    );

    validateSession$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sessionActions.validateSession),
            map(() => this.localStorageService.getUsername()),
            filter((username): username is string => username !== null && username !== undefined && username !== ''),
            switchMap((username) =>
                this.authService.validateSession(username).pipe(
                    map(() => sessionActions.validateSessionSuccess({ username })),
                    catchError(() => {
                        return of(sessionActions.validateSessionFailure());
                    })
                )
            )
        )
    );

    getUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sessionActions.validateSessionSuccess, loginActions.logInSuccess, editUserActions.editUserSuccess),
            throttleTime(1000),
            withLatestFrom(
                this.store.select(selectLoginValid),
                this.store.select(selectUsername),
            ),
            filter(([ , loginValid, username]) =>
                loginValid && username !== null && username.length > 0
            ),
            switchMap(([ , , username]) =>
                this.userService.getUser(username).pipe(
                    map(data => userDataActions.getUserSuccess(data)),
                    catchError(error => {
                        const message = error.error?.message || error.message || 'Error loading user data';
                        return of(userDataActions.getUserFailure({ message}));
                    })
                )
            )
        )
    );

    getUserStats$ = createEffect(() =>
        this.actions$.pipe(
            ofType(sessionActions.validateSessionSuccess, loginActions.logInSuccess),
            throttleTime(1000),
            withLatestFrom(
                this.store.select(selectLoginValid),
                this.store.select(selectUsername),
            ),
            filter(([ , loginValid, username]) =>
                loginValid && username !== null && username.length > 0
            ),
            switchMap(([ , , username]) =>
                this.userService.getUserStats(username).pipe(
                    map(data => userStatsActions.getUserStatsSuccess(data)),
                    catchError(error => {
                        const message = error.error?.message || error.message || 'Error loading user stats!';
                        return of(userStatsActions.getUserStatsFailure({ message }));
                    })
                )
            )
        )
    );

    editUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(editUserActions.editUser),
            throttleTime(1000),
            withLatestFrom(
                this.store.select(selectLoginValid),
                this.store.select(selectUsername),
            ),
            filter(([_, loginValid, username]) =>
                loginValid && username !== null && username.length > 0
            ),
            switchMap(([action, _, username]) =>
                this.userService.editUser(username, action.email, action.password, action.newPassword, action.firstname, action.lastname).pipe(
                    map(() => editUserActions.editUserSuccess()),
                    catchError(error => {
                        const message = error.error?.message || error.message || 'Error editing user data!';
                        return of(editUserActions.editUserFailure({ message }));
                    })
                )
            )
        )
    );


}