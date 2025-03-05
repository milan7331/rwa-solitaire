import { createReducer, on } from "@ngrx/store";
import { UserState } from "../../models/state/user.state";
import { AuthActions } from "../actions/auth.actions";

export const initialUserState: UserState = {
    userData: null,
    userStats: null,
}

export const userReducer = createReducer(
    initialUserState,
)