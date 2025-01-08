import { PartialType } from '@nestjs/mapped-types';
import { CreateGameHistoryDto } from './create-game-history.dto';
import { SolitaireDifficulty } from '../entities/game-history.entity';
import { User } from 'src/resources/user/entities/user.entity';
import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateGameHistoryDto {

    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsNumber()
    moves?: number;

    @IsOptional()
    @IsBoolean()
    gameWon?: boolean;

    @IsOptional()
    @IsBoolean()
    gameFinished?: boolean;

    @IsOptional()
    gameDifficulty?: SolitaireDifficulty;

    @IsOptional()
    @IsDate()
    startedTime?: Date;

    @IsOptional()
    @IsDate()
    finishedTime?: Date;

    @IsOptional()
    @IsNumber()
    gameDurationInSeconds?: number;

    @IsOptional()
    user?: User;
}
