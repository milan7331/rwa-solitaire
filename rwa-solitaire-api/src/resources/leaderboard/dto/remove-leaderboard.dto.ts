import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNumber, IsOptional } from "class-validator";

import { LeaderboardType } from "../entities/leaderboard.enum";

export class RemoveLeaderboardDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a number' })
    id?: number;

    @IsOptional()
    @Transform(({value}) => new Date(value))
    @IsDate({ message: 'timePeriod must be a valid Date object'})
    timePeriod?: Date;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsEnum(LeaderboardType, { message: 'Invalid type. Valid options are: WEEKLY (0), MONTHLY (1) and YEARLY (2)' })
    type?: LeaderboardType;
}