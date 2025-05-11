import { createReducer, on } from "@ngrx/store";
import { LeaderboardsState } from "../../models/state/leaderboards.state";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Leaderboard } from "../../models/leaderboard/leaderboard";
import { leaderboardsActions } from "../actions/leaderboards.actions";
import { LeaderboardType } from "../../models/leaderboard/leaderboard.enum";

export const leaderboardsAdapter: EntityAdapter<Leaderboard> = createEntityAdapter<Leaderboard>({
    // default
});

export const initialLeaderboardsState: LeaderboardsState = {
    displayedLeaderboardType: LeaderboardType.WEEKLY,

    weekly: leaderboardsAdapter.getInitialState(),
    monthly: leaderboardsAdapter.getInitialState(),
    yearly: leaderboardsAdapter.getInitialState(),
    
    weeklyPageCount: 0,
    monthlyPageCount: 0,
    yearlyPageCount: 0,
    
    pageIndex: 0,
}

export const leaderboardsReducer = createReducer(
    initialLeaderboardsState,
    on(leaderboardsActions.initializeLeaderboardsSuccess, (state, { weekly, monthly, yearly, weeklyPageCount, monthlyPageCount, yearlyPageCount }) => {
        
        return {
            displayedLeaderboardType: state.displayedLeaderboardType,
            weekly: leaderboardsAdapter.setAll(weekly, state.weekly),
            monthly: leaderboardsAdapter.setAll(monthly, state.monthly),
            yearly: leaderboardsAdapter.setAll(yearly, state.yearly),
            weeklyPageCount,
            monthlyPageCount,
            yearlyPageCount,
            pageIndex: 0,
        } as LeaderboardsState;
    }),
    on(leaderboardsActions.initializeLeaderboardsFailure, () => initialLeaderboardsState),
    on(leaderboardsActions.refreshPageCountSuccess, (state, { weeklyPageCount, monthlyPageCount, yearlyPageCount }) => {
        return {
            ...state,
            weeklyPageCount,
            monthlyPageCount,
            yearlyPageCount,
        } as LeaderboardsState;
    }),
    on(leaderboardsActions.loadAdditionalPagesSuccess, (state, { leaderboard, pageCount, leaderboardType }) => {
        if (state.displayedLeaderboardType !== leaderboardType) return state;

        switch (state.displayedLeaderboardType) {
            case LeaderboardType.WEEKLY: {
                return { ...state, weekly: leaderboardsAdapter.setAll(leaderboard, state.weekly), weeklyPageCount: pageCount } as LeaderboardsState;
            }
            case LeaderboardType.MONTHLY: {
                return { ...state, monthly: leaderboardsAdapter.setAll(leaderboard, state.monthly), monthlyPageCount: pageCount } as LeaderboardsState;
            }
            case LeaderboardType.YEARLY: {
                return { ...state, yearly: leaderboardsAdapter.setAll(leaderboard, state.yearly), yearlyPageCount: pageCount } as LeaderboardsState;
            }
            default: {
                return state;
            }
        }
    }),
    on(leaderboardsActions.showNextPage, (state) => {
        switch (state.displayedLeaderboardType) {
            case LeaderboardType.WEEKLY: {
                return { ...state, pageIndex: Math.min(state.pageIndex + 1, state.weeklyPageCount) } as LeaderboardsState;
            }
            case LeaderboardType.MONTHLY: {
                return { ...state, pageIndex: Math.min(state.pageIndex + 1, state.monthlyPageCount) } as LeaderboardsState;
            }
            case LeaderboardType.YEARLY: {
                return { ...state, pageIndex: Math.min(state.pageIndex + 1, state.yearlyPageCount )} as LeaderboardsState;
            }
            default: {
                return state; 
            }
        }
    }),
    on(leaderboardsActions.showPreviousPage, (state) => {
        return {
            ...state,
            pageIndex: Math.max(0, state.pageIndex - 1),
        } as LeaderboardsState;
    }),
    on(leaderboardsActions.setPageIndex, (state, { index }) => {
        switch (state.displayedLeaderboardType) {
            case LeaderboardType.WEEKLY: {
                return { ...state, pageIndex: Math.max(0, Math.min(index, state.weeklyPageCount)) } as LeaderboardsState;
            }
            case LeaderboardType.MONTHLY: {
                return { ...state, pageIndex: Math.max(0, Math.min(index, state.monthlyPageCount)) } as LeaderboardsState;
            }
            case LeaderboardType.YEARLY: {
                return { ...state, pageIndex: Math.max(0, Math.min(index, state.yearlyPageCount)) } as LeaderboardsState;
            }
            default: {
                return state;
            }
        }
    }),
    on(leaderboardsActions.resetPageIndex, (state) => {
        return { ...state, pageIndex: 0 } as LeaderboardsState;
    }),
);
