import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SavedGame } from 'src/resources/saved-game/entities/saved-game.entity';
import { SolitaireStats } from 'src/resources/solitaire-stats/entities/solitaire-stats.entity';
import { SolitaireHistory } from '../solitaire-history/entities/solitaire-history.entity';
import { HashService } from 'src/auth/hash.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SavedGame,
    SolitaireStats,
    SolitaireHistory,
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
