import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaderboardDto } from './create-leaderboard.dto';
import { WeeklyLeaderboard } from '../entities/leaderboard-weekly.entity';
import { MonthlyLeaderboard } from '../entities/leaderboard-monthly.entity';
import { YearlyLeaderboard } from '../entities/leaderboard-yearly.entity';
import { IsNumber } from 'class-validator';

export class UpdateLeaderboardDto extends PartialType(CreateLeaderboardDto) {
    @IsNumber()
    id?: number = undefined;

    type?: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard = undefined; 
}
