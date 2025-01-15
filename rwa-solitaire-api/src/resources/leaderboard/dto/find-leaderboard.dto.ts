import { IsBoolean, IsDate, IsNumber, IsOptional } from "class-validator"
import { WeeklyLeaderboard } from "../entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "../entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "../entities/leaderboard-yearly.entity";

export class FindLeaderboardDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsDate()
    timePeriod?: Date;

    @IsOptional()
    type?: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard;

    @IsBoolean()
    withDeleted: boolean = false;
}