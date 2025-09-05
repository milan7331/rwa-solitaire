import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "../../models/state/user.state";

const selectUserState = createFeatureSelector<UserState>('userState');

export const selectUserLoginValid = createSelector(
    selectUserState,
    (state) => state.loginValid
);

export const selectUser = createSelector(
    selectUserState,
    (state) => state.userData
);

export const selectUserStats = createSelector(
    selectUserState,
    (state) => state.userStats
);

export const selectUsername = createSelector(
    selectUser,
    (user) => user.username
);

export const selectUserSavedGame = createSelector(
    selectUserState,
    (state) => state.savedGame
);
