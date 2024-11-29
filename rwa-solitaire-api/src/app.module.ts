import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SolitaireDataModule } from './solitaire-data/solitaire-data.module';
import { SavedGameModule } from './saved-game/saved-game.module';
import { SavedGameModule } from './saved-game/saved-game.module';
import { SolitaireStatsModule } from './solitaire-stats/solitaire-stats.module';
import { SavedGameModule } from './saved-game/saved-game.module';

@Module({
  imports: [UserModule, SolitaireDataModule, SavedGameModule, SolitaireStatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
