import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/api/user/user.service";
import { userActions } from "../actions/user.actions";
import { catchError, exhaustMap, map, of } from "rxjs";


export class UserEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly userService: UserService,
    ) {}

    register$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(userActions.register),
            exhaustMap((action) => {
                return this.userService.register(action.email, action.username, action.password).pipe(
                    map(response => {
                        if (response) return userActions.registrationSuccess();
                        return userActions.registrationFailure({ message: 'Registration failed!'});
                    }),
                    catchError(error => of(userActions.registrationFailure( error.message )))
                );
            })
        );
    })



    
}