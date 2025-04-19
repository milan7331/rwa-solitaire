import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';

import { SolitaireDifficulty } from '../entities/game-history.entity';
import { POSTGRES_MAX_INTEGER } from 'src/util/postgres-constants';

export class UpdateGameHistoryDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'userId must be a valid number' })
    userId?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false}, { message: 'moves must be a valid number'})
    @Min(0, { message: 'moves value must be greater or equal to 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'moves value must not be greater or equal to ' + POSTGRES_MAX_INTEGER })
    moves?: number;

    @IsOptional()
    @IsBoolean({ message: 'gameWon must be a boolean' })
    gameWon?: boolean;

    @IsOptional()
    @IsBoolean({ message: 'gameFinished must be a boolean' })
    gameFinished?: boolean;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsEnum(SolitaireDifficulty, { message: 'Invalid gameDifficulty. Valid options are: Easy (0) and Hard (1)' })
    gameDifficulty?: SolitaireDifficulty;

    @IsOptional()
    @Transform(({ value }) => new Date(value)) // Auto-transform string/ISO dates to Date object
    @IsDate({ message: 'startedTime must be a valid Date object'})
    startedTime?: Date;

    @IsOptional()
    @Transform(({ value }) => new Date(value)) // Auto-transform string/ISO dates to Date object
    @IsDate({ message: 'startedTime must be a valid Date object'})
    finishedTime?: Date;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false}, { message: 'gameDurationInSeconds must be a valid number'})
    @Min(0, { message: 'gameDurationInSeconds must be greater or equal to 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'gameDurationInSeconds must not be greater or equal to ' + POSTGRES_MAX_INTEGER })
    gameDurationInSeconds?: number;
}
