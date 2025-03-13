import { IsDate, IsEnum, IsNumber, IsOptional } from "class-validator";
import { LeaderboardType } from "../entities/leaderboard.enum";

export class RemoveLeaderboardDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsDate()
    timePeriod?: Date;

    @IsOptional()
    @IsEnum(LeaderboardType)
    type?: LeaderboardType;
}