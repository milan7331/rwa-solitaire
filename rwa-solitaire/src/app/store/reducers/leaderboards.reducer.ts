import { createReducer, on } from "@ngrx/store";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";

import { LeaderboardsState } from "../../models/state/leaderboards.state";
import { Leaderboard } from "../../models/leaderboard/leaderboard";
import { leaderboardsActions } from "../actions/leaderboards.actions";

export const leaderboardsAdapter: EntityAdapter<Leaderboard> = createEntityAdapter<Leaderboard>({
    selectId: (leaderboard) => leaderboard.timePeriod.toISOString(),
    sortComparer: (leaderboardA, leaderboardB) => {
        const timeA = leaderboardA.timePeriod ? new Date(leaderboardA.timePeriod).getTime() : 0;
        const timeB = leaderboardB.timePeriod ? new Date(leaderboardB.timePeriod).getTime() : 0;
        return timeB - timeA;
    }
});

const initialLeaderboardsState: LeaderboardsState = {
    weeklyLeaderboards: leaderboardsAdapter.getInitialState(),
    monthlyLeaderboards: leaderboardsAdapter.getInitialState(),
    yearlyLeaderboards: leaderboardsAdapter.getInitialState(),
};

export const leaderboardsReducer = createReducer(
    initialLeaderboardsState,
    on(leaderboardsActions.getWeeklyLeaderboardSuccess, (state: LeaderboardsState, { leaderboards }) => {
        return {
            ...state,
            weeklyLeaderboards: leaderboardsAdapter.upsertMany(leaderboards, state.weeklyLeaderboards),
        } as LeaderboardsState;
    }),
    on(leaderboardsActions.getMonthlyLeaderboardSuccess, (state: LeaderboardsState, { leaderboards }) => {
        return {
            ...state,
            monthlyLeaderboards: leaderboardsAdapter.upsertMany(leaderboards, state.monthlyLeaderboards),
        } as LeaderboardsState;
    }),
    on(leaderboardsActions.getYearlyLeaderboardSuccess, (state: LeaderboardsState, { leaderboards }) => {
        return {
            ...state,
            yearlyLeaderboards: leaderboardsAdapter.upsertMany(leaderboards, state.yearlyLeaderboards),
        } as LeaderboardsState;
    })
);
