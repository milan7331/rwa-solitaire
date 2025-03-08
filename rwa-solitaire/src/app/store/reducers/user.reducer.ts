import { createReducer, on } from "@ngrx/store";
import { UserState } from "../../models/state/user.state";

export const initialUserState: UserState = {
    userData: null,
    userStats: null,
}

export const userReducer = createReducer(
    initialUserState,
)