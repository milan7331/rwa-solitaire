import { IsEnum, IsNotEmpty, IsNumber, IsOptional, Max, Min } from "class-validator";
import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";
import { LeaderboardType } from "../entities/leaderboard.enum";

export class GetLeaderboardDto {
    @IsNotEmpty()
    @IsNumber()
    take: number = 10;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    page: number = 0;

    @IsOptional()
    @IsEnum(LeaderboardType)
    type?: LeaderboardType;
}