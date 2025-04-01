import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/api/user/user.service";
import { Store } from "@ngrx/store";
import { catchError, map, switchMap, throttleTime, of, EMPTY, exhaustMap } from "rxjs";
import { loginValid } from "../../utils/operators/login-valid";
import { withUsername } from "../../utils/operators/with-username";
import { userEditActions, userMenuActions, userRegisterActions } from "../actions/user.actions";
import { inject, Injectable } from "@angular/core";

@Injectable()
export class UserEffects {
    private readonly actions$: Actions = inject(Actions);
    private readonly userService: UserService = inject(UserService);
    private readonly store: Store = inject(Store);

    registerUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userRegisterActions.register),
            exhaustMap((action) =>
                this.userService.register(
                    action.email,
                    action.username,
                    action.password,
                    action.firstname,
                    action.lastname
                ).pipe(
                    map(() => userRegisterActions.registerSuccess()),
                    catchError(error => {
                        console.error(error);
                        return EMPTY;
                    }),
                )
            )
        )
    );

    getUserData$ = createEffect(() => 
        this.actions$.pipe(
            ofType(userEditActions.getUserData),
            throttleTime(1000),
            loginValid(this.store),
            withUsername(this.store),
            switchMap((username) => 
                this.userService.getUserData(username).pipe(
                    map(data => userEditActions.getUserDataSuccess(data)),
                    catchError(error => {
                        console.error(error);
                        return EMPTY;
                    }),
                )
            )
        )
    );

    getUserStats$ = createEffect(() =>
        this.actions$.pipe(
            ofType(userMenuActions.getUserStats),
            throttleTime(1000),
            loginValid(this.store),
            withUsername(this.store),
            switchMap((username) =>
                this.userService.getUserStats(username).pipe(
                    map(stats => userMenuActions.getUserStatsSuccess(stats)),
                    catchError(error => {
                        console.error(error);
                        return EMPTY;
                    }),
                )
            )
        )
    );
}
