import { Transform, Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { LeaderboardType } from '../entities/leaderboard.enum';
import { LeaderboardRow } from '../entities/leaderboard.row';

export class UpdateLeaderboardDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsEnum(LeaderboardType, { message: 'Invalid type. Valid options are: WEEKLY (0), MONTHLY (1) and YEARLY (2)' })
    leaderboardType?: LeaderboardType;

    @Transform(({ value }) => new Date(value)) // Auto-transform string/ISO dates to Date object
    @IsDate({ message: 'timePeriod must be a valid Date object'})
    timePeriod?: Date;

    @IsOptional()
    @IsArray({ message: 'top20_averageTime must be an array' })
    @Type(() => LeaderboardRow)
    top20_averageTime?: LeaderboardRow[];

    @IsOptional()
    @IsArray({ message: 'top20_bestTime must be an array' })
    @Type(() => LeaderboardRow)
    top20_bestTime?: LeaderboardRow[];

    @IsOptional()
    @IsArray({ message: 'top20_numberOfMoves must be an array' })
    @Type(() => LeaderboardRow)
    top20_numberOfMoves?: LeaderboardRow[];

    @IsOptional()
    @IsArray({ message: 'top20_gamesPlayed must be an array' })
    @Type(() => LeaderboardRow)
    top20_gamesPlayed?: LeaderboardRow[];
}
