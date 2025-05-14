import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LeaderboardsState } from "../../models/state/leaderboards.state";
import { LeaderboardType } from "../../models/leaderboard/leaderboard.enum";
import { leaderboardsAdapter } from "../reducers/leaderboards.reducer";
import { Leaderboard } from "../../models/leaderboard/leaderboard";

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


// entity selectors
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


// main selectors
export const selectLeaderboardType = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.displayedLeaderboardType
);

export const selectPageIndex = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.pageIndex
);

export const selectLeaderboardLoading = createSelector(
    selectLeaderboardsState,
    (state: LeaderboardsState) => state.loading
)

export const selectLeaderboardPageCount = createSelector(
    selectLeaderboardsState,
    selectLeaderboardType,
    (state, displayedType) => {
        switch(displayedType) {
            case LeaderboardType.WEEKLY: return state.weeklyPageCount;
            case LeaderboardType.MONTHLY: return state.monthlyPageCount;
            case LeaderboardType.YEARLY: return state.yearlyPageCount;
            default: return 0;
        }
    }
);

const selectLeaderboard = createSelector(
    selectAllWeekly,
    selectAllMonthly,
    selectAllYearly,
    selectLeaderboardType,
    (weekly, monthly, yearly, displayedType) => {
        switch (displayedType) {
            case LeaderboardType.WEEKLY: return weekly;
            case LeaderboardType.MONTHLY: return monthly;
            case LeaderboardType.YEARLY: return yearly;
            default: return [];
        };
    } 
);

const selectLeaderboardTotal = createSelector(
    selectLeaderboardType,
    selectTotalWeekly,
    selectTotalMonthly,
    selectTotalYearly,
    (totalWeekly, totalMonthly, totalYearly, displayedType) => {
        switch (displayedType) {
            case LeaderboardType.WEEKLY: return totalWeekly;
            case LeaderboardType.MONTHLY: return totalMonthly;
            case LeaderboardType.YEARLY: return totalYearly;
            default: return 0;
        }
    }
);

export const selectLeaderboardPage = createSelector(
    selectLeaderboard,
    selectLeaderboardLoading,
    selectLeaderboardTotal,
    selectPageIndex,
    (leaderboard, loading, total, index) => {
        if (index >= total && loading) return { timePeriod: new Date(), top20_averageTime: [], top20_bestTime: [], top20_gamesPlayed: [], top20_numberOfMoves: [] } as Leaderboard;
        return leaderboard[index];
    }
);
