import { Module } from '@nestjs/common';
import { SolitaireHistoryService } from './solitaire-history.service';
import { SolitaireHistoryController } from './solitaire-history.controller';

@Module({
  controllers: [SolitaireHistoryController],
  providers: [SolitaireHistoryService],
})
export class SolitaireHistoryModule {}
