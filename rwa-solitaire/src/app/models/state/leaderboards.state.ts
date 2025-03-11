import { EntityState } from "@ngrx/entity";
import { MonthlyLeaderboard, WeeklyLeaderboard, YearlyLeaderboard } from "../leaderboard/leaderboard";

export interface LeaderboardsState {
    weeklyLeaderboards: EntityState<WeeklyLeaderboard>;
    monthlyLeaderboards: EntityState<MonthlyLeaderboard>;
    yearlyLeaderboards: EntityState<YearlyLeaderboard>;
}
