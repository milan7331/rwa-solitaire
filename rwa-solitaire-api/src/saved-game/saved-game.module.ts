import { Module } from '@nestjs/common';
import { SavedGameService } from './saved-game.service';
import { SavedGameController } from './saved-game.controller';

@Module({
  controllers: [SavedGameController],
  providers: [SavedGameService],
})
export class SavedGameModule {}
