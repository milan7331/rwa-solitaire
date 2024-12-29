import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from './resoruces/user/user.module';
import { SavedGameModule } from './resoruces/saved-game/saved-game.module';
import { SolitaireStatsModule } from './resoruces/solitaire-stats/solitaire-stats.module';
import { AuthModule } from './auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './resoruces/user/entities/user.entity';
import { SavedGame } from './resoruces/saved-game/entities/saved-game.entity';
import { SolitaireStats } from './resoruces/solitaire-stats/entities/solitaire-stats.entity';
import { Guard } from './auth/auth.guard'; // ne koristi se kasnije rešiti
import { DatabaseModule } from './database/database.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';
import { LeaderboardModule } from './resources/leaderboard/leaderboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,  // možda treba dodati entitete manuelno? videćemo kasnije
        synchronize: true, // prepraviti kasnije!!!
      })
    }),
    UserModule, 
    SavedGameModule, 
    SolitaireStatsModule,
    AuthModule,
    DatabaseModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
