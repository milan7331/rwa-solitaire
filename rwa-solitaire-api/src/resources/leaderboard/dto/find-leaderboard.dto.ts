import { IsBoolean, IsDate, IsNumber, IsOptional } from "class-validator"
import { WeeklyLeaderboard } from "../entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "../entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "../entities/leaderboard-yearly.entity";

export class FindLeaderboardDto {
    @IsNumber()
    id?: number = undefined;

    @IsDate()
    timePeriod?: Date = undefined;

    type?: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard = undefined;

    @IsBoolean()
    withDeleted: boolean = false;
}