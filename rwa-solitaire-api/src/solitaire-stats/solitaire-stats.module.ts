import { Module } from '@nestjs/common';
import { SolitaireStatsService } from './solitaire-stats.service';
import { SolitaireStatsController } from './solitaire-stats.controller';

@Module({
  controllers: [SolitaireStatsController],
  providers: [SolitaireStatsService],
})
export class SolitaireStatsModule {}
