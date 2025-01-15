import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { UserData } from "../entities/userdata";
import { WeeklyLeaderboard } from "../entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "../entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "../entities/leaderboard-yearly.entity";

export class CreateLeaderboardDto {
    @IsNotEmpty()
    @IsDate()
    timePeriod: Date;

    @IsNotEmpty()
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard;

    @IsArray()
    top20_averageTime: UserData[] = [];

    @IsArray()
    top20_bestTime: UserData[] = [];

    @IsArray()
    top20_numberOfMoves: UserData[] = [];

    @IsArray()
    top20_gamesPlayed: UserData[] = [];
}
