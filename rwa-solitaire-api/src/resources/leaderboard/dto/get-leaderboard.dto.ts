import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, Max, Min } from "class-validator";

import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";
import { LeaderboardType } from "../entities/leaderboard.enum";

export class GetLeaderboardDto {
    @Transform(({ value }) => parseInt(value, 10))
    @IsNotEmpty({ message: 'take is required' })
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'take must be a valid number' })
    @Min(20, { message: 'take must be greater or equal to 10' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'take must not be greater or equal to ' + POSTGRES_MAX_INTEGER })
    take: number = 10;

    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'page is required'})
    @IsNumber({ allowInfinity: false, allowNaN: false}, { message: 'page must be a valid number'})
    @Min(0, { message: 'page must be greater or equal to 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'page must not be greater or equal to ' + POSTGRES_MAX_INTEGER })
    skip: number = 0;

    @Transform(({ value }) => parseInt(value, 10))
    @IsNotEmpty({ message: 'type is required'})
    @IsEnum(LeaderboardType, { message: 'Invalid type. Valid options are: WEEKLY (0), MONTHLY (1) and YEARLY (2)' })
    leaderboardType: LeaderboardType;
}