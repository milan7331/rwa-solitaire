import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/api/user/user.service";
import { userActions } from "../actions/user.actions";
import { catchError, debounceTime, exhaustMap, map, of, switchMap, throttleTime } from "rxjs";
import { AuthActions } from "../actions/auth.actions";


export class UserEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly userService: UserService,
    ) {}


    // register$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(userActions.register),
    //         exhaustMap((action) => {
    //             return this.userService.register(action.email, action.username, action.password, action.firstname, action.lastname).pipe(
    //                 map(() => AuthActions.logIn({ username: action.username, password: action.password })),
    //                 catchError(error => {
    //                     console.error(error.message);
    //                     return of(userActions.registrationFailure());
    //                 }),
    //             );
    //         })
    //     );
    // })

    // getUserData$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(userActions.getUserData),
    //         throttleTime(1000),
    //         switchMap((action) => {
    //             return this.userService.getUserData(action.username).pipe(
    //                 map(data => userActions.getUserDataSuccess(data)),
    //                 catchError(error => {
    //                     console.log(error.message);
    //                     return of(userActions.getUserDataFailure());
    //                 })
    //             );
    //         })
    //     );
    // });

    // getUserStats$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(userActions.getUserStats),
    //         throttleTime(1000),
    //         switchMap((action) => {
    //             return this.userService.getUserStats(action.username).pipe(
    //                 map(stats => userActions.getUserStatsSuccess(stats)),
    //                 catchError(error => {
    //                     console.error(error.message);
    //                     return of(userActions.getUserStatsFailure());
    //                 })
    //             )

    //         })
    //     )
    // })



    
}