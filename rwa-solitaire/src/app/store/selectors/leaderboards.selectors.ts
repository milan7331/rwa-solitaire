import { createFeatureSelector, createSelector } from "@ngrx/store";

import { LeaderboardsState } from "../../models/state/leaderboards.state";
import { leaderboardsAdapter } from "../reducers/leaderboards.reducer";

const { selectAll, selectTotal } = leaderboardsAdapter.getSelectors();

const selectLeaderboardsState = createFeatureSelector<LeaderboardsState>('leaderboardsState');

const selectWeeklyLeaderboardsState = createSelector(
    selectLeaderboardsState,
    (state) => state.weeklyLeaderboards,
);

const selectMonthlyLeaderboardsState = createSelector(
    selectLeaderboardsState,
    (state) => state.monthlyLeaderboards,
);

const selectYearlyLeaderboardsState = createSelector(
    selectLeaderboardsState,
    (state) => state.yearlyLeaderboards,
);

export const selectAllWeeklyLeaderboards = createSelector(
    selectWeeklyLeaderboardsState,
    selectAll,
);

export const selectAllMonthlyLeaderboards = createSelector(
    selectMonthlyLeaderboardsState,
    selectAll,
);

export const selectAllYearlyLeaderboards = createSelector(
    selectYearlyLeaderboardsState,
    selectAll,
);

export const selectWeeklyLeaderboardsCount = createSelector(
    selectWeeklyLeaderboardsState,
    selectTotal,
);

export const selectMonthlyLeaderboardsCount = createSelector(
    selectMonthlyLeaderboardsState,
    selectTotal,
);

export const selectYearlyLeaderboardsCount = createSelector(
    selectYearlyLeaderboardsState,
    selectTotal,
);
