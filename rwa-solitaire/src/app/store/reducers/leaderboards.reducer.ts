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

const initialLeaderboardsState: LeaderboardsState = {
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

const initializeLeaderboardsHandlers = [
    on(leaderboardsActions.initializeLeaderboards, (state: LeaderboardsState) => {
        return { ...state, loading: true };
    }),
    on(leaderboardsActions.initializeLeaderboardsSuccess, (state: LeaderboardsState, { weekly, monthly, yearly, weeklyPageCount, monthlyPageCount, yearlyPageCount }) => {
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
];

const loadAdditionalPagesHandlers = [
    on(leaderboardsActions.loadAdditionalPages, (state: LeaderboardsState) => {
        return { ...state, loading: true };
    }),
    on(leaderboardsActions.loadAdditionalPagesSuccess, (state: LeaderboardsState, { leaderboardType, pageCount, pages }) => {
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
    on(leaderboardsActions.loadAdditionalPagesFailure, (state: LeaderboardsState) => {
        return { ...state, loading: false };
    }),
];

const pageChangeHandlers = [
on(leaderboardsActions.showNextPage, (state: LeaderboardsState) => {
        return updateStatePageIndex_Pure(state, state.pageIndex + 1);
    }),
    on(leaderboardsActions.showPreviousPage, (state: LeaderboardsState) => {
        return updateStatePageIndex_Pure(state, state.pageIndex - 1);
    }),
    on(leaderboardsActions.showFirstPage, (state: LeaderboardsState) => {
        return updateStatePageIndex_Pure(state, 0);
    }),
    on(leaderboardsActions.showLastPage, (state: LeaderboardsState) => {
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
    on(leaderboardsActions.setPageIndex, (state: LeaderboardsState, { index }) => {
        return updateStatePageIndex_Pure(state, index);
    }),
    on(leaderboardsActions.resetPageIndex, (state: LeaderboardsState) => {
        return { ...state, pageIndex: 0 } as LeaderboardsState;
    }),
];

const leaderboardTypeChangeHandlers = [
    on(leaderboardsActions.changeLeaderboardType, (state: LeaderboardsState, { leaderboardType }) => {
        if (state.displayedLeaderboardType === leaderboardType) return state;
        return { ...state, displayedLeaderboardType: leaderboardType } as LeaderboardsState;
    }),
    on(leaderboardsActions.resetLeaderboardType, (state: LeaderboardsState) => {
        return { ...state, displayedLeaderboardType: LeaderboardType.WEEKLY } as LeaderboardsState;
    }),
];

const pageCountChangeHandlers = [
    on(leaderboardsActions.refreshPageCountSuccess, (state: LeaderboardsState, { weeklyPageCount, monthlyPageCount, yearlyPageCount }) => {
        return {
            ...state,
            weeklyPageCount,
            monthlyPageCount,
            yearlyPageCount,
        } as LeaderboardsState;
    }),
];

const leaderboardsLoadingHandlers = [
    on(leaderboardsActions.toggleLoading, (state: LeaderboardsState) => {
        return { ...state, loading: !state.loading } as LeaderboardsState;
    }),
];

export const leaderboardsReducer = createReducer(
    initialLeaderboardsState,
    ...initializeLeaderboardsHandlers,
    ...loadAdditionalPagesHandlers,
    ...pageChangeHandlers,
    ...leaderboardTypeChangeHandlers,
    ...pageCountChangeHandlers,
    ...leaderboardsLoadingHandlers,
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
