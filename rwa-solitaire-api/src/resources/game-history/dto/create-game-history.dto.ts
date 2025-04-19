import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber } from "class-validator";

import { SolitaireDifficulty } from "../entities/game-history.entity";

export class CreateGameHistoryDto {
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'gameDifficulty is required' })
    @IsEnum(SolitaireDifficulty, { message: 'Invalid gameDifficulty. Valid options are: Easy (0) and Hard (1)' })
    gameDifficulty: SolitaireDifficulty;

    @Transform(({ value }) => new Date(value)) // Auto-transform string/ISO dates to Date object
    @IsNotEmpty({ message: 'startedTime is required' })
    @IsDate({ message: 'startedTime must be a valid Date object'})
    startedTime: Date;

    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNotEmpty({ message: 'userId is required' })
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'userId must be a valid number' })
    userId: number;
}
