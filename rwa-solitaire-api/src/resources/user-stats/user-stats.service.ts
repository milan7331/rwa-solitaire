import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserStatsDto } from './dto/create-user-stats.dto';
import { UpdateUserStatsDto } from './dto/update-user-stats.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { UserStats } from './entities/user-stats.entity';
import { handlePostgresError } from 'src/util/postgres-error-handler';
import { FindUserStatsDto } from './dto/find-user-stats.dto';
import { RemoveUserStatsDto } from './dto/remove-user-stats.dto';
import { UserService } from '../user/user.service';
import { UserStatsReponseDto } from './dto/user-stats-response.dto';
import { POSTGRES_MAX_INTEGER } from 'src/util/postgres-constants';

@Injectable()
export class UserStatsService {
  constructor(
    @InjectRepository(UserStats)
    private readonly userStatsRepository: Repository<UserStats>,

    private readonly userService: UserService,
  ) { }

  async create(createDto: CreateUserStatsDto): Promise<void> {
    const { userId, gamesPlayed, gamesWon, totalTimePlayed, averageSolveTime, fastestSolveTime } = createDto;
    if (createDto.userId === undefined) throw new BadRequestException('Invalid parameters!');

    const existingStats = await this.userStatsRepository.findOne({
      where: {
        user: { id: userId }
      }
    });
    if (existingStats) throw new ConflictException('user-stats already exists for this user!');

    const user = await this.userService.findOne({ id: createDto.userId, withDeleted: false, withRelations: false });
    if (!user) throw new NotFoundException('user-stats cant be created for non existing user!');

    try {
      await this.userStatsRepository.save({
        gamesPlayed,
        gamesWon,
        totalTimePlayed,
        averageSolveTime,
        fastestSolveTime,
        user
      } as DeepPartial<UserStats>);
    } catch (error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindUserStatsDto): Promise<UserStats | null> {
    const { id, userId, username, withDeleted } = findDto;
    if (id === undefined && userId === undefined && username === undefined) throw new BadRequestException('Invalid parameters!');

    let result = null;

    const where: any = { };
    if (id !== undefined) where.id = id;
    if (userId !== undefined) where.user = { id: userId };
    if (username !== undefined) {
      if (where.user) where.user.username = username;
      else where.user = { username: username };
    }

    try {
      result = await this.userStatsRepository.findOne({
        where,
        withDeleted
      });
    } catch (error) {
      handlePostgresError(error);
    }

    return result;
  }

  async update(updateDto: UpdateUserStatsDto): Promise<void> {
    const { id, userId } = updateDto;
    if (id === undefined && userId === undefined) throw new BadRequestException('Invalid parameters!');

    const findDto: FindUserStatsDto = {
      id,
      userId,
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
    const { id, userId } = removeDto;
    if (id === undefined && userId === undefined) throw new BadRequestException('Invalid parameters!');

    const findDto: FindUserStatsDto = {
      id,
      userId,
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
    const { id, userId } = restoreDto;
    if (id === undefined && userId === undefined) throw new BadRequestException('Invalid parameters!');

    const findDto: FindUserStatsDto = {
      id,
      userId,
      withDeleted: true
    }

    const stats = await this.findOne(findDto);
    if (!stats) throw new NotFoundException('No user-stats to restore found!');

    try {
      const result = await this.userStatsRepository.restore(stats.id);
      if (result.affected <= 0) throw new BadRequestException('Error restoring user stats!');
    } catch (error) {
      handlePostgresError(error);
    }
  }

  cleanUpUserStatsResponse(stats: UserStats): UserStatsReponseDto {
    const response: any = {};
    if (stats.id !== undefined && stats.id !== null) response.id = stats.id;
    if (stats.gamesPlayed !== undefined && stats.gamesPlayed !== null) response.gamesPlayed = stats.gamesPlayed;
    if (stats.gamesWon !== undefined && stats.gamesWon !== null) response.gamesWon = stats.gamesWon;
    if (stats.totalTimePlayed !== undefined && stats.totalTimePlayed !== null) response.totalTimePlayed = stats.totalTimePlayed;
    if (stats.averageSolveTime !== undefined && stats.averageSolveTime !== null) response.averageSolveTime = stats.averageSolveTime;
    if (stats.fastestSolveTime !== undefined && stats.fastestSolveTime !== null) response.fastestSolveTime = stats.fastestSolveTime;

    if (response.averageSolveTime === POSTGRES_MAX_INTEGER) response.averageSolveTime = 0;
    if (response.fastestSolveTime === POSTGRES_MAX_INTEGER) response.fastestSolveTime = 0;

    return response as UserStatsReponseDto;
  }
}
