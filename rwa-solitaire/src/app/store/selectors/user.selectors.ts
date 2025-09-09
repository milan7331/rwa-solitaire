import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "../../models/state/user.state";

const selectUserState = createFeatureSelector<UserState>('userState');

export const selectLoginValid = createSelector(
    selectUserState,
    (state) => state.loginValid
);

export const selectRegisterValid = createSelector(
    selectUserState,
    (state) => state.registerValid
);

export const selectUser = createSelector(
    selectUserState,
    (state) => state.user
);

export const selectUsername = createSelector(
    selectUser,
    (user) => user.username
);

export const selectUserStats = createSelector(
    selectUserState,
    (state) => state.userStats
);

export const selectUserSavedGame = createSelector(
    selectUserState,
    (state) => state.savedGame
);

export const selectRegisterLoading = createSelector(
    selectUserState,
    (state) => state.registerLoading
);

export const selectLoginLoading = createSelector(
    selectUserState,
    (state) => state.loginLoading
);

export const selectUserDataLoading = createSelector(
    selectUserState,
    (state) => state.userDataLoading
);

export const selectUserStatsLoading = createSelector(
    selectUserState,
    (state) => state.userStatsLoading
);

export const selectRegisterErrorMessage = createSelector(
    selectUserState,
    (state) => state.registerErrorMessage
);

export const selectLoginErrorMessage = createSelector(
    selectUserState,
    (state) => state.loginErrorMessage
);

export const selectUserDataErrorMessage = createSelector(
    selectUserState,
    (state) => state.userDataErrorMessage
);

export const selectUserStatsErrorMessage = createSelector(
    selectUserState,
    (state) => state.userStatsErrorMessage
);

export const selectEditValid = createSelector(
    selectUserState,
    (state) => state.editValid
);

export const selectEditUserLoading = createSelector(
    selectUserState,
    (state) => state.editUserLoading
);

export const selectEditUserMessage = createSelector(
    selectUserState,
    (state) => state.editUserErrorMessage,
);