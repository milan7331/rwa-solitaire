import { IsArray, IsDate, IsEnum, IsNotEmpty } from "class-validator";
import { UserData } from "../entities/userdata";
import { LeaderboardType } from "../entities/leaderboard.enum";

export class CreateLeaderboardDto {
    @IsNotEmpty()
    @IsDate()
    timePeriod: Date;

    @IsNotEmpty()
    @IsEnum(LeaderboardType)
    type: LeaderboardType;

    @IsArray()
    top20_averageTime: UserData[] = [];

    @IsArray()
    top20_bestTime: UserData[] = [];

    @IsArray()
    top20_numberOfMoves: UserData[] = [];

    @IsArray()
    top20_gamesPlayed: UserData[] = [];
}
