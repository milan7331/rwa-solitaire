import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";

export class CreateUserStatsDto {
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'userId is required' })
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'userId must be a valid number' })
    userId: number;

    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'gamesPlayed is required'})
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'gamesPlayed must be a valid number' })
    @Min(0, { message: 'gamesPlayed must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'gamesPlayed must be less or equal to ' + POSTGRES_MAX_INTEGER })
    gamesPlayed: number = 0;

    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'gamesWon is required'})
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'gamesWon must be a valid number' })
    @Min(0, { message: 'gamesWon must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'gamesWon must be less or equal to ' + POSTGRES_MAX_INTEGER })
    gamesWon: number = 0;

    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'totalTimePlayed is required'})
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'totalTimePlayed must be a valid number' })
    @Min(0, { message: 'totalTimePlayed must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'totalTimePlayed must be less or equal to ' + POSTGRES_MAX_INTEGER })
    totalTimePlayed: number = 0;

    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'averageSolveTime is required'})
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'averageSolveTime must be a valid number' })
    @Min(0, { message: 'averageSolveTime must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'AverageSolveTime must be less or equal to ' + POSTGRES_MAX_INTEGER })
    averageSolveTime: number = POSTGRES_MAX_INTEGER;

    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'fastestSolveTime is required'})
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'fastestSolveTime must be a valid number' })
    @Min(0, { message: 'fastestSolveTime must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'fastestSolveTime must be less or equal to ' + POSTGRES_MAX_INTEGER })
    fastestSolveTime: number = POSTGRES_MAX_INTEGER;
}
