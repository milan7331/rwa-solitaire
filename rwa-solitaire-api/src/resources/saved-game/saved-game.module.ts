import { Module } from '@nestjs/common';
import { SavedGameService } from './saved-game.service';
import { SavedGameController } from './saved-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedGame } from './entities/saved-game.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavedGame]),
    User,
  ],
  controllers: [SavedGameController],
  providers: [SavedGameService],
})
export class SavedGameModule {}
