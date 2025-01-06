import { ConflictException, Injectable } from '@nestjs/common';
import { CreateSolitaireStatsDto } from './dto/create-solitaire-stats.dto';
import { UpdateSolitaireStatsDto } from './dto/update-solitaire-stats.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { SolitaireStats } from './entities/solitaire-stats.entity';
import { User } from '../user/entities/user.entity';
import { HashService } from 'src/auth/hash.service';

@Injectable()
export class SolitaireStatsService {
  constructor(
    @InjectRepository(SolitaireStats)
    private solitaireStatsRepository: Repository<SolitaireStats>,
  ) { }

  async create(user?: User): Promise<boolean> {
    let stats = new SolitaireStats();

    stats.gamesPlayed = 0;
    stats.gamesWon = 0;
    stats.totalTimePlayed = 0;
    stats.averageSolveTime = null;
    stats.fastestSolveTime = null;
    stats.user = user ? user : null;

    try {
      const existingStats = await this.solitaireStatsRepository.findOne({
        where: { user: user }
      });
      if (existingStats) throw new ConflictException('Solitaire-Stats already exists for this user!');

      await this.solitaireStatsRepository.save(stats);
      return true;
    } catch (error) {
      console.error(error.message);
      throw new Error('Error creating solitaire-stats! | solitaire-stats.service.ts');
    }
  }

  async findOne(id: number, withDeleted: boolean, withRelations: boolean): Promise<SolitaireStats | null> {
    try {
      let stats = await this.solitaireStatsRepository.findOne({
        where: { id },
        withDeleted: withDeleted,
        relations: withRelations ? ['user'] : []
      });
      return stats;
    } catch (error) {
      console.error(error.message);
      throw new Error('Error finding solitaire-stats! | solitaire-stats.service.ts');
    }
  }

  async update(id: number, updateSolitaireStatsDto: UpdateSolitaireStatsDto): Promise<boolean> {
    try {
      await this.solitaireStatsRepository.update(id, updateSolitaireStatsDto);
      return true;
    } catch (error) {
      console.error(error.message);
      throw new Error('Error updating solitaire-stats! | solitaire-stats.service.ts');
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const stats = await this.findOne(id, false, false);
      if (!stats) return false;

      await this.solitaireStatsRepository.softRemove(stats);
      return true;
    } catch (error) {
      console.error(error.message);
      throw new Error('Error softRemoving solitaire-stats! | solitaire-stats.service');
    }
  }

  async restore(id: number): Promise<boolean> {
    try {
      const stats = await this.findOne(id, true, false);
      if (!stats) return false;

      await this.solitaireStatsRepository.restore(stats);
      return true;
    } catch (error) {
      console.error(error.message);
      throw new Error('Error restoring solitaire-stats! | solitaire-stats.service.ts');
    }
  }
}
