import { LeaderboardType } from "./leaderboard.enum";

export interface GetLeaderboardDto {
    take: number,
    page: number,
    leaderboardType: LeaderboardType,
}
