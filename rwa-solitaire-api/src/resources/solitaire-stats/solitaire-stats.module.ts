import { Module } from '@nestjs/common';
import { SolitaireStatsService } from './solitaire-stats.service';
import { SolitaireStatsController } from './solitaire-stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolitaireStats } from './entities/solitaire-stats.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SolitaireStats]),
    User,
  ],
  controllers: [SolitaireStatsController],
  providers: [SolitaireStatsService],
})
export class SolitaireStatsModule {}
