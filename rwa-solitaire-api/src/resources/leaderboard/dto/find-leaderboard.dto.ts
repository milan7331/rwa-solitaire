import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator"
import { LeaderboardType } from "../entities/leaderboard.enum";

export class FindLeaderboardDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsDate()
    timePeriod?: Date;

    @IsOptional()
    @IsEnum(LeaderboardType)
    type?: LeaderboardType;

    @IsNotEmpty()
    @IsBoolean()
    withDeleted: boolean = false;
}