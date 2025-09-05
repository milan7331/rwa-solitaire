import { EntityState } from "@ngrx/entity";
import { Leaderboard } from "../leaderboard/leaderboard";
import { LeaderboardType } from "../leaderboard/leaderboard.enum";


export interface LeaderboardsState {
    weekly: EntityState<Leaderboard>;
    monthly: EntityState<Leaderboard>;
    yearly: EntityState<Leaderboard>;

    weeklyPageCount: number;
    monthlyPageCount: number;
    yearlyPageCount: number;

    displayedLeaderboardType: LeaderboardType; // used to switch between leaderboard types
    pageIndex: number; // used to switch between leaderboard array of chosen type

    loading: boolean;
}
