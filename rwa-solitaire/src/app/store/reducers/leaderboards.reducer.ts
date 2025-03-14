import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { LeaderboardsState } from "../../models/state/leaderboards.state";
import { Leaderboard } from "../../models/leaderboard/leaderboard";
import { createReducer } from "@ngrx/store";

export const leaderboardsAdapter: EntityAdapter<Leaderboard> = createEntityAdapter<Leaderboard>({
    // popuniti kasnije kada se prenesu modeli
});

export const initialLeaderboardsState: LeaderboardsState = {
    weeklyLeaderboards: leaderboardsAdapter.getInitialState(),
    monthlyLeaderboards: leaderboardsAdapter.getInitialState(),
    yearlyLeaderboards: leaderboardsAdapter.getInitialState(),
};

export const leaderboardsReducer = createReducer(
    initialLeaderboardsState,
);
