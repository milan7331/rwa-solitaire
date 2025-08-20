import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

import { POSTGRES_MAX_INTEGER } from 'src/util/postgres-constants';

export class UpdateUserStatsDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'userId must be a valid number' })
    userId?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'gamesPlayed must be a valid number' })
    @Min(0, { message: 'gamesPlayed must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'gamesPlayed must be less or equal to ' + POSTGRES_MAX_INTEGER })
    gamesPlayed?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'gamesWon must be a valid number' })
    @Min(0, { message: 'gamesWon must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'gamesWon must be less or equal to ' + POSTGRES_MAX_INTEGER })
    gamesWon?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'totalTimePlayed must be a valid number' })
    @Min(0, { message: 'totalTimePlayed must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'totalTimePlayed must be less or equal to ' + POSTGRES_MAX_INTEGER })
    totalTimePlayed?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'averageSolveTime must be a valid number' })
    @Min(0, { message: 'averageSolveTime must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'AverageSolveTime must be less or equal to ' + POSTGRES_MAX_INTEGER })
    averageSolveTime?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'fastestSolveTime must be a valid number' })
    @Min(0, { message: 'fastestSolveTime must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'fastestSolveTime must be less or equal to ' + POSTGRES_MAX_INTEGER })
    fastestSolveTime?: number;
}
