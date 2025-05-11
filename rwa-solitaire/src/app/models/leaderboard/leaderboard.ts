import { LeaderboardRow } from "./leaderboard.row";

export interface Leaderboard {
    timePeriod: Date;

    top20_averageTime: LeaderboardRow[];
    top20_bestTime: LeaderboardRow[];
    top20_numberOfMoves: LeaderboardRow[];
    top20_gamesPlayed: LeaderboardRow[];
}

export interface WeeklyLeaderboard extends Leaderboard { }

export interface MonthlyLeaderboard extends Leaderboard { }

export interface YearlyLeaderboard extends Leaderboard { }
