import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "../../models/state/user.state";

const selectUserState = createFeatureSelector<UserState>('userState');

export const selectUserloginValid = createSelector(
    selectUserState,
    (state) => state.loginValid
);

export const selectUserData = createSelector(
    selectUserState,
    (state) => state.userData
);

export const selectUserStats = createSelector(
    selectUserState,
    (state) => state.userStats
);

export const selectUsername = createSelector(
    selectUserData,
    (data) => data.username
);

export const selectUserSavedGame = createSelector(
    selectUserState,
    (state) => state.savedGame
);
