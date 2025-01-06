import { PartialType } from '@nestjs/mapped-types';
import { CreateSolitaireHistoryDto } from './create-solitaire-history.dto';
import { SolitaireDifficulty } from '../entities/solitaire-history.entity';
import { User } from 'src/resources/user/entities/user.entity';
import { IsBoolean, IsDate, IsNumber, IsOptional } from 'class-validator';

export class UpdateSolitaireHistoryDto {
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
