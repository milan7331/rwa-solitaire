import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserStatsDto } from './dto/create-user-stats.dto';
import { UpdateUserStatsDto } from './dto/update-user-stats.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { UserStats } from './entities/user-stats.entity';
import { User } from '../user/entities/user.entity';
import { HashService } from 'src/auth/hash.service';

@Injectable()
export class UserStatsService {
  constructor(
    @InjectRepository(UserStats)
    private userStatsRepository: Repository<UserStats>,
  ) { }

  async create(createStatsDto: CreateUserStatsDto): Promise<boolean> {
    const existingStats = await this.userStatsRepository.findOne({
      where: { user: createStatsDto.user }
    });
    if (existingStats) throw new ConflictException('user-stats already exists for this user!');

    try {
      await this.userStatsRepository.save(createStatsDto);
      return true;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error creating user-stats! | user-stats.service.ts');
    }
  }

  async findOne(
    id: number | null = null,
    user: User | null = null,
    withDeleted: boolean,
    withRelations: boolean
  ): Promise<UserStats | null> {
    if (!id && !user) return null;

    const where: any = { };
    if (id) where.id = id;
    if (user) where.user = user;

    try {
      let stats = await this.userStatsRepository.findOne({
        where,
        withDeleted,
        relations: withRelations ? ['user'] : []
      });
      return stats;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error finding user-stats! | user-stats.service.ts');
    }
  }

  async update(
    id: number | null = null,
    user: User | null = null,
    updateUserStatsDto: UpdateUserStatsDto
  ): Promise<boolean> {
    if (!id && !user) return false;

    const stats = this.findOne(id, user, false, false);
    if (!stats) throw new Error('No stats to update found! | user-stats.service.ts');

    try {
      const result = await this.userStatsRepository.update(id, updateUserStatsDto);
      if (result.affected > 0) return true;
      return false;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error updating user-stats! | user-stats.service.ts');
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
      await this.userStatsRepository.softRemove(stats);
      return true;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error softRemoving user-stats! | user-stats.service');
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
      await this.userStatsRepository.restore(stats);
      return true;
    } catch (error) {
      console.error('Error: ' + error);
      throw new Error('Error restoring user-stats! | user-stats.service.ts');
    }
  }
}
