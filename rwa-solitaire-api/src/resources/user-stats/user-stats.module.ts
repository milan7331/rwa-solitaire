import { Module } from '@nestjs/common';
import { UserStatsService } from './user-stats.service';
import { UserStatsController } from './user-stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStats } from './entities/user-stats.entity';
import { User } from 'src/resources/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserStats]),
    User,
  ],
  controllers: [UserStatsController],
  providers: [UserStatsService],
})
export class UserStatsModule {}
