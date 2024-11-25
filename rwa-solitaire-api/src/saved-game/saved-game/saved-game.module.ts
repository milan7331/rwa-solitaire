import { Module } from '@nestjs/common';
import { SavedGameController } from './saved-game.controller';

@Module({
  controllers: [SavedGameController]
})
export class SavedGameModule {}
