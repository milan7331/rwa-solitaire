import { IsDate, IsNumber, IsOptional } from "class-validator";
import { MonthlyLeaderboard } from "../entities/leaderboard-monthly.entity";
import { WeeklyLeaderboard } from "../entities/leaderboard-weekly.entity";
import { YearlyLeaderboard } from "../entities/leaderboard-yearly.entity";

export class RemoveLeaderboardDto {
    @IsNumber()
    id?: number = undefined;

    @IsDate()
    timePeriod?: Date = undefined;

    type?: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard = undefined;
}