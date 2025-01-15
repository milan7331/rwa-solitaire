import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaderboardDto } from './create-leaderboard.dto';
import { WeeklyLeaderboard } from '../entities/leaderboard-weekly.entity';
import { MonthlyLeaderboard } from '../entities/leaderboard-monthly.entity';
import { YearlyLeaderboard } from '../entities/leaderboard-yearly.entity';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateLeaderboardDto extends PartialType(CreateLeaderboardDto) {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    type?: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard; 
}
