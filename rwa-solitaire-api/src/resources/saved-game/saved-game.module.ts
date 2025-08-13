import { Module } from '@nestjs/common';
import { SavedGameService } from './saved-game.service';
import { SavedGameController } from './saved-game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedGame } from './entities/saved-game.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SavedGame]),
    UserModule,
  ],
  controllers: [SavedGameController],
  providers: [SavedGameService],
  exports: [TypeOrmModule]
})
export class SavedGameModule {}
