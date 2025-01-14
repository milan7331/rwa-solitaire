import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './resources/user/user.module';
import { SavedGameModule } from './resources/saved-game/saved-game.module';
import { UserStatsModule } from './resources/user-stats/user-stats.module';
import { AuthModule } from './auth/auth.module';
import { LeaderboardModule } from './resources/leaderboard/leaderboard.module';
import { UtilModule } from './util/util.module';
import { GameHistoryModule } from './resources/game-history/game-history.module';
import { ScheduleModule } from '@nestjs/schedule';

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
        logging: false,
        autoLoadEntities: true,
        synchronize: true, // prepraviti kasnije!!!
      })
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    GameHistoryModule,
    LeaderboardModule,
    SavedGameModule, 
    UserModule, 
    UserStatsModule,
    UtilModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
