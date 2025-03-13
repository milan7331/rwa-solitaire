import { SolitaireDifficulty } from '../entities/game-history.entity';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { POSTGRES_MAX_INTEGER } from 'src/util/postgres-constants';

export class UpdateGameHistoryDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    moves?: number;

    @IsOptional()
    @IsBoolean()
    gameWon?: boolean;

    @IsOptional()
    @IsBoolean()
    gameFinished?: boolean;

    @IsOptional()
    @IsEnum(SolitaireDifficulty)
    gameDifficulty?: SolitaireDifficulty;

    @IsOptional()
    @IsDate()
    startedTime?: Date;

    @IsOptional()
    @IsDate()
    finishedTime?: Date;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    gameDurationInSeconds?: number;
}
