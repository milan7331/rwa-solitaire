import { createReducer, on } from "@ngrx/store";
import { LeaderboardsState } from "../../models/state/leaderboards.state";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Leaderboard } from "../../models/leaderboard/leaderboard";
import { leaderboardsActions } from "../actions/leaderboards.actions";
import { LeaderboardType } from "../../models/leaderboard/leaderboard.enum";

export const leaderboardsAdapter: EntityAdapter<Leaderboard> = createEntityAdapter<Leaderboard>({
    selectId: (leaderboard) => leaderboard.timePeriod.toISOString(),
    sortComparer: (a: Leaderboard, b: Leaderboard) => b.timePeriod.getTime() - a.timePeriod.getTime(),
});

export const initialLeaderboardsState: LeaderboardsState = {
    weekly: leaderboardsAdapter.getInitialState(),
    monthly: leaderboardsAdapter.getInitialState(),
    yearly: leaderboardsAdapter.getInitialState(),
    
    weeklyPageCount: 0,
    monthlyPageCount: 0,
    yearlyPageCount: 0,
    
    displayedLeaderboardType: LeaderboardType.WEEKLY,
    pageIndex: 0,
    
    loading: true,
}

export const leaderboardsReducer = createReducer(
    initialLeaderboardsState,
    on(leaderboardsActions.initializeLeaderboards, (state) => {
        return { ...state, loading: true };
    }),
    on(leaderboardsActions.initializeLeaderboardsSuccess, (state, { weekly, monthly, yearly, weeklyPageCount, monthlyPageCount, yearlyPageCount }) => {
        return {
            weekly: leaderboardsAdapter.setAll(weekly, state.weekly),
            monthly: leaderboardsAdapter.setAll(monthly, state.monthly),
            yearly: leaderboardsAdapter.setAll(yearly, state.yearly),
            weeklyPageCount,
            monthlyPageCount,
            yearlyPageCount,
            displayedLeaderboardType: state.displayedLeaderboardType,
            pageIndex: 0,
            loading: false,
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
    on(leaderboardsActions.loadAdditionalPages, (state) => {
        return { ...state, loading: true };
    }),
    on(leaderboardsActions.loadAdditionalPagesSuccess, (state, { leaderboardType, pageCount, pages}) => {
        pages.forEach(p => console.log(p.timePeriod));
        switch (leaderboardType) {
            case LeaderboardType.WEEKLY: {
                return { ...state, weekly: leaderboardsAdapter.setAll(pages, state.weekly), weeklyPageCount: pageCount, loading: false } as LeaderboardsState;
            }
            case LeaderboardType.MONTHLY: {
                return { ...state, monthly: leaderboardsAdapter.setAll(pages, state.monthly), monthlyPageCount: pageCount, loading: false } as LeaderboardsState;
            }
            case LeaderboardType.YEARLY: {
                return { ...state, yearly: leaderboardsAdapter.setAll(pages, state.yearly), yearlyPageCount: pageCount, loading: false } as LeaderboardsState;
            }
            default: {
                return state;
            }
        }
    }),
    on(leaderboardsActions.loadAdditionalPagesFailure, (state) => {
        return { ...state, loading: false };
    }),
    on(leaderboardsActions.showNextPage, (state) => {
        return updateStatePageIndex_Pure(state, state.pageIndex + 1);
    }),
    on(leaderboardsActions.showPreviousPage, (state) => {
        return updateStatePageIndex_Pure(state, state.pageIndex - 1);
    }),
    on(leaderboardsActions.showFirstPage, (state) => {
        return updateStatePageIndex_Pure(state, 0);
    }),
    on(leaderboardsActions.showLastPage, (state) => {
        switch (state.displayedLeaderboardType) {
            case LeaderboardType.WEEKLY: {
                return updateStatePageIndex_Pure(state, state.weeklyPageCount - 1);
            }
            case LeaderboardType.MONTHLY: {
                return updateStatePageIndex_Pure(state, state.monthlyPageCount - 1);
            }
            case LeaderboardType.YEARLY: {
                return updateStatePageIndex_Pure(state, state.yearlyPageCount - 1);
            }
            default: return state;
        }
    }),
    on(leaderboardsActions.setPageIndex, (state, { index }) => {
        return updateStatePageIndex_Pure(state, index);
    }),
    on(leaderboardsActions.resetPageIndex, (state) => {
        return { ...state, pageIndex: 0 } as LeaderboardsState;
    }),
    on(leaderboardsActions.toggleLoading, (state) => {
        return { ...state, loading: !state.loading } as LeaderboardsState;
    }),
    on(leaderboardsActions.changeLeaderboardType, (state, { leaderboardType: LeaderboardType}) => {
        if (state.displayedLeaderboardType === LeaderboardType) return state;
        return { ...state, displayedLeaderboardType: LeaderboardType } as LeaderboardsState;
    }),
    on(leaderboardsActions.resetLeaderboardType, (state)=> {
        return { ...state, displayedLeaderboardType: LeaderboardType.WEEKLY } as LeaderboardsState;
    }),
);

function updateStatePageIndex_Pure(state: LeaderboardsState, newIndex: number): LeaderboardsState {
    switch (state.displayedLeaderboardType) {
        case LeaderboardType.WEEKLY: {
            return { ...state, pageIndex: Math.max(0, Math.min(newIndex, state.weeklyPageCount - 1)) } as LeaderboardsState;
        }
        case LeaderboardType.MONTHLY: {
            return { ...state, pageIndex: Math.max(0, Math.min(newIndex, state.monthlyPageCount - 1)) } as LeaderboardsState;
        }
        case LeaderboardType.YEARLY: {
            return { ...state, pageIndex: Math.max(0, Math.min(newIndex, state.yearlyPageCount - 1)) } as LeaderboardsState;
        }
        default: {
            return state;
        }
    }
}
