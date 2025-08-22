import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, Max, Min } from 'class-validator';

import { POSTGRES_MAX_INTEGER } from 'src/util/postgres-constants';

export class EndGameHistoryDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'userId must be a valid number' })
    userId?: number;

    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'moves is required' })
    @IsNumber({ allowInfinity: false, allowNaN: false}, { message: 'moves must be a valid number'})
    @Min(0, { message: 'moves value must be greater or equal to 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'moves value must not be greater or equal to ' + POSTGRES_MAX_INTEGER })
    moves: number = POSTGRES_MAX_INTEGER;

    @IsNotEmpty({ message: 'gameWon is required' })
    @IsBoolean({ message: 'gameWon must be a boolean' })
    gameWon: boolean = false;

    @Transform(({ value }) => new Date(value)) // Auto-transform string/ISO dates to Date object
    @IsNotEmpty({ message: 'startedTime is required' })
    @IsDate({ message: 'startedTime must be a valid Date object'})
    startedTime?: Date;

    @Transform(({ value }) => new Date(value)) // Auto-transform string/ISO dates to Date object
    @IsNotEmpty({ message: 'finishedTime is required' })
    @IsDate({ message: 'finishedTime must be a valid Date object'})
    finishedTime: Date = new Date();

    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'gameDurationInSeconds is required' })
    @IsNumber({ allowInfinity: false, allowNaN: false}, { message: 'gameDurationInSeconds must be a valid number'})
    @Min(0, { message: 'gameDurationInSeconds must be greater or equal to 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'gameDurationInSeconds must not be greater or equal to ' + POSTGRES_MAX_INTEGER })
    gameDurationInSeconds: number = POSTGRES_MAX_INTEGER;
}
