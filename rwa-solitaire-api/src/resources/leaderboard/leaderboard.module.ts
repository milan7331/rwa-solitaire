import { forwardRef, Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistoryModule } from '../game-history/game-history.module';
import { WeeklyLeaderboard } from './entities/leaderboard-weekly.entity';
import { MonthlyLeaderboard } from './entities/leaderboard-monthly.entity';
import { YearlyLeaderboard } from './entities/leaderboard-yearly.entity';
import { Leaderboard } from './entities/leaderboard.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Leaderboard,
      WeeklyLeaderboard, 
      MonthlyLeaderboard, 
      YearlyLeaderboard
    ]),
    forwardRef(() => GameHistoryModule)
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [
    TypeOrmModule,
    LeaderboardService
  ]
})
export class LeaderboardModule {}
