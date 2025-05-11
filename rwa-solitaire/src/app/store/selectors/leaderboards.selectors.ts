import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LeaderboardsState } from "../../models/state/leaderboards.state";
import { LeaderboardType } from "../../models/leaderboard/leaderboard.enum";
import { leaderboardsAdapter } from "../reducers/leaderboards.reducer";

const selectLeaderboardsState = createFeatureSelector<LeaderboardsState>('leaderboardsState');

const selectWeeklyLeaderboardState = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.weekly
);

const selectMonthlyLeaderboardState = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.monthly
);

const selectYearlyLeaderboardState = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.yearly
);

const {
    selectAll: selectAllWeekly,
    selectTotal: selectTotalWeekly,
} = leaderboardsAdapter.getSelectors(selectWeeklyLeaderboardState);

const {
    selectAll: selectAllMonthly,
    selectTotal: selectTotalMonthly,
} = leaderboardsAdapter.getSelectors(selectMonthlyLeaderboardState);

const {
    selectAll: selectAllYearly,
    selectTotal: selectTotalYearly,
} = leaderboardsAdapter.getSelectors(selectYearlyLeaderboardState);

const selectDisplayedLeaderboardType = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.displayedLeaderboardType
)

export const selectWeeklyLeaderboardPageCount = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.weeklyPageCount
);

export const selectMonthlyLeaderboardPageCount = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.monthlyPageCount
);

export const selectYearlyLeaderboardPageCount = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.yearlyPageCount
);

export const selectPageIndex = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.pageIndex
);

export const selectLeaderboard = createSelector(
    selectAllWeekly,
    selectAllMonthly,
    selectAllYearly,
    selectDisplayedLeaderboardType,
    (weekly, monthly, yearly, displayedType) => {
        switch (displayedType) {
            case LeaderboardType.WEEKLY: return weekly;
            case LeaderboardType.MONTHLY: return monthly;
            case LeaderboardType.YEARLY: return yearly;
            default: return undefined;
        };
    } 
);

export const selectLeaderboardIsLoading = createSelector(
    selectTotalWeekly,
    selectTotalMonthly,
    selectTotalYearly,
    selectPageIndex,
    selectDisplayedLeaderboardType,
    (weeklyInStore, monthlyInStore, yearlyInStore, currentIndex, displayedType) => {
        switch (displayedType) {
            case LeaderboardType.WEEKLY: {
                return currentIndex >= weeklyInStore ? true : false;
            }
            case LeaderboardType.MONTHLY: {
                return currentIndex >= monthlyInStore ? true : false;
            }
            case LeaderboardType.YEARLY: {
                return currentIndex >= yearlyInStore ? true : false;
            }
            default: return false;
        };
    }
);
