import { Module } from '@nestjs/common';
import { SavedGameService } from './saved-game.service';
import { SavedGameController } from './saved-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedGame } from './entities/saved-game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SavedGame])],
  controllers: [SavedGameController],
  providers: [SavedGameService],
  exports: [
    TypeOrmModule,
    SavedGameService
  ]
})
export class SavedGameModule {}
