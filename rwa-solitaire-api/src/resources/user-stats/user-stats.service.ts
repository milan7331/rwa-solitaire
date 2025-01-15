import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserStatsDto } from './dto/create-user-stats.dto';
import { UpdateUserStatsDto } from './dto/update-user-stats.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserStats } from './entities/user-stats.entity';
import { handlePostgresError } from 'src/util/postgres-error-handler';
import { FindUserStatsDto } from './dto/find-user-stats.dto';
import { RemoveUserStatsDto } from './dto/remove-user-stats.dto';

@Injectable()
export class UserStatsService {
  constructor(
    @InjectRepository(UserStats)
    private readonly userStatsRepository: Repository<UserStats>,
  ) { }

  async create(createDto: CreateUserStatsDto): Promise<boolean> {
    const existingStats = await this.userStatsRepository.findOne({
      where: { user: createDto.user }
    });
    if (existingStats) throw new ConflictException('user-stats already exists for this user!');

    try {
      await this.userStatsRepository.save(createDto);

      return true;
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindUserStatsDto): Promise<UserStats | null> {
    const { id, user, withDeleted } = findDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

    const where: any = { };
    if (id) where.id = id;
    if (user) where.user = user;

    try {
      let stats = await this.userStatsRepository.findOne({
        where,
        withDeleted
      });

      return stats;
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async update(updateDto: UpdateUserStatsDto): Promise<boolean> {
    const { id, user } = updateDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');;

    const findDto: FindUserStatsDto = {
      id,
      user,
      withDeleted: false
    }

    const stats = await this.findOne(findDto);
    if (!stats) throw new NotFoundException('No stats to update found!');

    try {
      const result = await this.userStatsRepository.update(stats.id, updateDto);
      
      if (result.affected > 0) return true;
      return false;
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveUserStatsDto): Promise<boolean> {
    const { id, user } = removeDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');
    
    const findDto: FindUserStatsDto = {
      id,
      user,
      withDeleted: false
    }

    const stats = await this.findOne(findDto);
    if (!stats) throw new NotFoundException('No user-stats to remove found!');
    
    try {
      await this.userStatsRepository.softRemove(stats);

      return true;
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async restore(restoreDto: RemoveUserStatsDto): Promise<boolean> {
    const { id, user } = restoreDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

    const findDto: FindUserStatsDto = {
      id,
      user,
      withDeleted: false
    }

    const stats = await this.findOne(findDto);
    if (!stats) throw new NotFoundException('No user-stats to restore found!');
    
    try {
      const result = await this.userStatsRepository.restore(stats);

      if (result.affected > 0) return true;
      return false;
    } catch (error) {
      handlePostgresError(error);
    }
  }
}
