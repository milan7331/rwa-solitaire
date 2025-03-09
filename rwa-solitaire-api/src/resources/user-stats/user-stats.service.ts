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

  async create(createDto: CreateUserStatsDto): Promise<void> {
    if (!createDto.user) throw new BadRequestException('Invalid parameters!');

    const existingStats = await this.userStatsRepository.findOne({
      where: { user: createDto.user }
    });
    if (existingStats) throw new ConflictException('user-stats already exists for this user!');

    try {
      await this.userStatsRepository.save(createDto);
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindUserStatsDto): Promise<UserStats> {
    const { id, user, withDeleted } = findDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

    let result = null;

    const where: any = { };
    if (id) where.id = id;
    if (user) where.user = user;

    try {
      result = await this.userStatsRepository.findOne({
        where,
        withDeleted
      });
    } catch (error) {
      handlePostgresError(error);
    }

    if (!result) throw new NotFoundException('User stats not found!');
    return result;
  }

  async update(updateDto: UpdateUserStatsDto): Promise<void> {
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
      if (result.affected <= 0) throw new BadRequestException('Error updating user stats!');
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveUserStatsDto): Promise<void> {
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
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async restore(restoreDto: RemoveUserStatsDto): Promise<void> {
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
      if (result.affected <= 0) throw new BadRequestException('Error restoring user stats!');
    } catch (error) {
      handlePostgresError(error);
    }
  }
}
