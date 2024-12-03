import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SavedGame } from 'src/saved-game/entities/saved-game.entity';
import { SolitaireStats } from 'src/solitaire-stats/entities/solitaire-stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SavedGame,
    SolitaireStats,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
