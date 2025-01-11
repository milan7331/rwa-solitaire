import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserStatsDto } from './dto/create-user-stats.dto';
import { UpdateUserStatsDto } from './dto/update-user-stats.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { UserStats } from './entities/user-stats.entity';
import { User } from '../user/entities/user.entity';
import { HashService } from 'src/auth/hash.service';
import { handlePostgresError } from 'src/database/postgres-error-handler';

@Injectable()
export class UserStatsService {
  constructor(
    @InjectRepository(UserStats)
    private readonly userStatsRepository: Repository<UserStats>,
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
      handlePostgresError(error);
    }
  }

  async findOne(
    id: number | null = null,
    user: User | null = null,
    withDeleted: boolean,
    withRelations: boolean
  ): Promise<UserStats | null> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

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
      handlePostgresError(error);
    }
  }

  async update(
    id: number | null = null,
    user: User | null = null,
    updateUserStatsDto: UpdateUserStatsDto
  ): Promise<boolean> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');;

    const stats = this.findOne(id, user, false, false);
    if (!stats) throw new NotFoundException('No stats to update found!');

    try {
      const result = await this.userStatsRepository.update(id, updateUserStatsDto);
      if (result.affected > 0) return true;
      return false;
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async remove(
    id: number | null = null,
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');
    
    const stats = await this.findOne(id, user, false, false);
    if (!stats) throw new NotFoundException('No user-stats to remove found!');
    
    try {
      await this.userStatsRepository.softRemove(stats);
      return true;
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async restore(
    id: number | null = null,
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');
    
    const stats = await this.findOne(id, user, true, false);
    if (!stats) throw new NotFoundException('No user-stats to restore found!');
    
    try {
      await this.userStatsRepository.restore(stats);
      return true;
    } catch (error) {
      handlePostgresError(error);
    }
  }
}
