import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from './resources/user/user.module';
import { SavedGameModule } from './resources/saved-game/saved-game.module';
import { SolitaireStatsModule } from './resources/solitaire-stats/solitaire-stats.module';
import { AuthModule } from './auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { User } from './resources/user/entities/user.entity';
import { SavedGame } from './resources/saved-game/entities/saved-game.entity';
import { SolitaireStats } from './resources/solitaire-stats/entities/solitaire-stats.entity';
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
        autoLoadEntities: true,
        synchronize: true, // prepraviti kasnije!!!
      })
    }),
    UserModule, 
    SavedGameModule, 
    SolitaireStatsModule,
    AuthModule,
    LeaderboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
