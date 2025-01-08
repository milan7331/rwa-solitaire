import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SavedGame } from 'src/resources/saved-game/entities/saved-game.entity';
import { UserStats } from 'src/resources/user-stats/entities/user-stats.entity';
import { GameHistory } from '../game-history/entities/game-history.entity';
import { HashService } from 'src/auth/hash.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SavedGame,
    UserStats,
    GameHistory,
    HashService
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    TypeOrmModule,
    UserService
  ]
})
export class UserModule {}
