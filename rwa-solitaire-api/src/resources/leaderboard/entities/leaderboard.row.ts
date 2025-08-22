import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";
import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";

export class LeaderboardRow {
    @Transform(({ value }) => value?.trim())
    @IsNotEmpty({ message: 'username is required' })
    @IsString({ message: 'username must be a string' })
    @MinLength(6, { message: 'username must be at least 6 characters long' })
    @MaxLength(32, { message: 'username cannot exceed 32 characters in length' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username can only contain letters, numbers, and underscores' })
    username: string;

    @Transform(({ value }) => parseInt(value, 10))
    @IsNotEmpty({ message: 'score is required'})
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'score must be a valid number' })
    @Min(0, { message: 'score must be greater or equal than 0' })
    @Max(POSTGRES_MAX_INTEGER, { message: 'score must be less or equal to ' + POSTGRES_MAX_INTEGER })
    score: number;
}