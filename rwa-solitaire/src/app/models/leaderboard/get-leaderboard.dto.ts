import { LeaderboardType } from "./leaderboard.enum";

export interface GetLeaderboardDto {
    take: number,
    skip: number,
    leaderboardType: LeaderboardType,
}
