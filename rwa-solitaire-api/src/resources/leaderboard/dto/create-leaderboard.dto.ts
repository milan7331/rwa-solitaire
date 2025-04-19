import { Transform } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsNotEmpty } from "class-validator";

import { UserData } from "../entities/userdata";
import { LeaderboardType } from "../entities/leaderboard.enum";

export class CreateLeaderboardDto {
    @Transform(({ value }) => new Date(value)) // Auto-transform string/ISO dates to Date object
    @IsNotEmpty({ message: 'timePeriod is required' })
    @IsDate({ message: 'timePeriod must be a valid Date object'})
    timePeriod: Date;

    @Transform(({ value }) => parseInt(value, 10))
    @IsNotEmpty({ message: 'type is required (enum LeaderboardType)' })
    @IsEnum(LeaderboardType, { message: 'Invalid type. Valid options are: WEEKLY (0), MONTHLY (1) and YEARLY (2)' })
    type: LeaderboardType;

    // UserData dtos omitted, as this is not going to be used over the network, only for mock data generation...
    @IsArray({ message: 'top20_averageTime must be an array' })
    top20_averageTime: UserData[] = [];

    @IsArray({ message: 'top20_bestTime must be an array' })
    top20_bestTime: UserData[] = [];

    @IsArray({ message: 'top20_numberOfMoves must be an array' })
    top20_numberOfMoves: UserData[] = [];

    @IsArray({ message: 'top20_gamesPlayed must be an array' })
    top20_gamesPlayed: UserData[] = [];
}
