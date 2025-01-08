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

  async create(createStatsDto: CreateSolitaireStatsDto): Promise<boolean> {
    const existingStats = await this.solitaireStatsRepository.findOne({
      where: { user: createStatsDto.user }
    });
    if (existingStats) throw new ConflictException('Solitaire-Stats already exists for this user!');

    try {
      await this.solitaireStatsRepository.save(createStatsDto);
      return true;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error creating solitaire-stats! | solitaire-stats.service.ts');
    }
  }

  async findOne(
    id: number | null = null,
    user: User | null = null,
    withDeleted: boolean,
    withRelations: boolean
  ): Promise<SolitaireStats | null> {
    if (!id && !user) return null;

    const where: any = { };
    if (id) where.id = id;
    if (user) where.user = user;

    try {
      let stats = await this.solitaireStatsRepository.findOne({
        where,
        withDeleted,
        relations: withRelations ? ['user'] : []
      });
      return stats;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error finding solitaire-stats! | solitaire-stats.service.ts');
    }
  }

  async update(
    id: number | null = null,
    user: User | null = null,
    updateSolitaireStatsDto: UpdateSolitaireStatsDto
  ): Promise<boolean> {
    if (!id && !user) return false;

    const stats = this.findOne(id, user, false, false);
    if (!stats) throw new Error('No stats to update found! | solitaire-stats.service.ts');

    try {
      const result = await this.solitaireStatsRepository.update(id, updateSolitaireStatsDto);
      if (result.affected > 0) return true;
      return false;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error updating solitaire-stats! | solitaire-stats.service.ts');
    }
  }

  async remove(
    id: number | null = null,
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) return false;
    
    const stats = await this.findOne(id, user, false, false);
    if (!stats) return false;
    
    try {
      await this.solitaireStatsRepository.softRemove(stats);
      return true;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error softRemoving solitaire-stats! | solitaire-stats.service');
    }
  }

  async restore(
    id: number | null = null,
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) return false;
    
    const stats = await this.findOne(id, user, true, false);
    if (!stats) return false;
    
    try {
      await this.solitaireStatsRepository.restore(stats);
      return true;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error restoring solitaire-stats! | solitaire-stats.service.ts');
    }
  }
}
