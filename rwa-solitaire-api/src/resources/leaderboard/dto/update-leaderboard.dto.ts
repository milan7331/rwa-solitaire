import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { CreateLeaderboardDto } from './create-leaderboard.dto';
import { LeaderboardType } from '../entities/leaderboard.enum';

export class UpdateLeaderboardDto extends PartialType(CreateLeaderboardDto) {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsEnum(LeaderboardType, { message: 'Invalid type. Valid options are: WEEKLY (0), MONTHLY (1) and YEARLY (2)' })
    leaderboardType?: LeaderboardType;
}
