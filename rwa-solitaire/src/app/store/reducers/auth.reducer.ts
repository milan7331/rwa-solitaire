import { createReducer, on } from "@ngrx/store";
import { AuthState } from "../../models/state/auth.state";
import { AuthActions } from "../actions/auth.actions";

export const initialAuthState: AuthState = {
    isLoggedIn: false
}

export const AuthReducer = createReducer(
    initialAuthState,
    on(AuthActions.logInSuccess, (state) => {
        return {
            ...state,
            isLoggedIn: true,
        } as AuthState;
    }),
    on(AuthActions.logoutSuccess, (state) => {
        return {
            ...state,
            isLoggedIn: false,
        } as AuthState;
    }),
)