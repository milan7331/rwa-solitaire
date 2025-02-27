import { SolitaireDifficulty } from '../entities/game-history.entity';
import { User } from 'src/resources/user/entities/user.entity';
import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
import { POSTGRES_MAX_INTEGER } from 'src/util/postgres-constants';

export class UpdateGameHistoryDto {
    @IsOptional()
    @IsNumber()
    id?: number = undefined;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    moves?: number = undefined;

    @IsOptional()
    @IsBoolean()
    gameWon?: boolean = undefined;

    @IsOptional()
    @IsBoolean()
    gameFinished?: boolean = undefined;

    @IsOptional()
    @IsEnum(SolitaireDifficulty)
    gameDifficulty?: SolitaireDifficulty = undefined;

    @IsOptional()
    @IsDate()
    startedTime?: Date = undefined;

    @IsOptional()
    @IsDate()
    finishedTime?: Date = undefined;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    gameDurationInSeconds?: number = undefined;

    @IsOptional()
    user?: User = undefined;
}
