import { forwardRef, Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryController } from './game-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameHistory } from './entities/game-history.entity';
import { UserStatsModule } from '../user-stats/user-stats.module';
import { UtilModule } from 'src/util/util.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GameHistory]),
    UserStatsModule,
    forwardRef(() => UtilModule)
  ],
  controllers: [GameHistoryController],
  providers: [GameHistoryService],
  exports: [
    TypeOrmModule,
    GameHistoryService
  ]
})
export class GameHistoryModule {}
