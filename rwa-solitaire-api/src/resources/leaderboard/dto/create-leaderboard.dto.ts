import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty } from "class-validator";

import { LeaderboardType } from "../entities/leaderboard.enum";
import { LeaderboardRow } from "../entities/leaderboard.row";

export class CreateLeaderboardDto {
    @Transform(({ value }) => new Date(value)) // Auto-transform string/ISO dates to Date object
    @IsNotEmpty({ message: 'timePeriod is required' })
    @IsDate({ message: 'timePeriod must be a valid Date object'})
    timePeriod: Date;

    @Transform(({ value }) => parseInt(value, 10))
    @IsNotEmpty({ message: 'type is required (enum LeaderboardType)' })
    @IsEnum(LeaderboardType, { message: 'Invalid type. Valid options are: WEEKLY (0), MONTHLY (1) and YEARLY (2)' })
    leaderboardType: LeaderboardType;

    @IsArray({ message: 'top20_averageTime must be an array' })
    @Type(() => LeaderboardRow)
    top20_averageTime: LeaderboardRow[] = [];

    @IsArray({ message: 'top20_bestTime must be an array' })
    @Type(() => LeaderboardRow)
    top20_bestTime: LeaderboardRow[] = [];

    @IsArray({ message: 'top20_numberOfMoves must be an array' })
    @Type(() => LeaderboardRow)
    top20_numberOfMoves: LeaderboardRow[] = [];

    @IsArray({ message: 'top20_gamesPlayed must be an array' })
    @Type(() => LeaderboardRow)
    top20_gamesPlayed: LeaderboardRow[] = [];
}
