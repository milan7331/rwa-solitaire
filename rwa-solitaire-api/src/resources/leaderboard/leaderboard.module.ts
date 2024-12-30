import { Module } from '@nestjs/common';
import { LeaderboardWeeklyService } from './leaderboard.weekly.service';
import { LeaderboardMonthlyService } from './leaderboard.monthly.service';
import { LeaderboardYearlyService } from './leaderboard.yearly.service';
import { LeaderboardController } from './leaderboard.controller';

@Module({
  controllers: [LeaderboardController],
  providers: [
    LeaderboardWeeklyService,
    LeaderboardMonthlyService,
    LeaderboardYearlyService
  ],
  exports: [
    LeaderboardWeeklyService,
    LeaderboardMonthlyService,
    LeaderboardYearlyService
  ]
})
export class LeaderboardModule {}
