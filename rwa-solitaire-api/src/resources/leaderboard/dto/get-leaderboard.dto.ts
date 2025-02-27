import { IsNumber, IsOptional, Max, Min } from "class-validator";
import { WeeklyLeaderboard } from "../entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "../entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "../entities/leaderboard-yearly.entity";
import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";

export class GetLeaderboardDto {
    @IsNumber()
    take: number = 10;

    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    page: number = 0;

    @IsOptional()
    type?: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard = undefined;
}