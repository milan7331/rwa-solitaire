import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaderboardDto } from './create-leaderboard.dto';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { LeaderboardType } from '../entities/leaderboard.enum';

export class UpdateLeaderboardDto extends PartialType(CreateLeaderboardDto) {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsEnum(LeaderboardType)
    type?: LeaderboardType;
}
