import { Module } from '@nestjs/common';
import { UserStatsService } from './user-stats.service';
import { UserStatsController } from './user-stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStats } from './entities/user-stats.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserStats]),
    UserModule,
  ],
  controllers: [UserStatsController],
  providers: [UserStatsService],
  exports: [
    TypeOrmModule,
    UserStatsService
  ]
})
export class UserStatsModule {}
