import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { GameHistory } from './entities/game-history.entity';
import { CreateGameHistoryDto } from './dto/create-game-history.dto';
import { UpdateGameHistoryDto } from './dto/update-game-history.dto';
import { CronService } from 'src/util/cron.service';
import { UserStatsService } from '../user-stats/user-stats.service';
import { handlePostgresError } from 'src/util/postgres-error-handler';
import { FindGameHistoryDto } from './dto/find-game-history.dto';
import { RemoveGameHistoryDto } from './dto/remove-game-history.dto';
import { FindUserStatsDto } from '../user-stats/dto/find-user-stats.dto';
import { Response } from 'express';

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory)
    private readonly historyRepository: Repository<GameHistory>,
    @Inject(forwardRef(() => CronService)) private readonly cronService: CronService,
    private readonly statsService: UserStatsService
  ) {}

  // used for leaderboard generation only
  async getAllGamesFromThisWeek(): Promise<[GameHistory[], Date]> {
    const [weekStartDate, weekEndDate] = this.cronService.getCleanDateSpan_CurrentWeek();
    const games = await this.#getAllGamesFromTimeSpan(weekStartDate, weekEndDate);
    return [games, weekStartDate];
  }
  
  // used for leaderboard generation only
  async getAllGamesFromThisMonth(): Promise<[GameHistory[], Date]> {
    const [monthStartDate, monthEndDate] = this.cronService.getCleanDateSpan_CurrentMonth();
    const games = await this.#getAllGamesFromTimeSpan(monthStartDate, monthEndDate);
    return [games, monthStartDate];
  }
  
  // used for leaderboard generation only
  async getAllGamesFromThisYear(): Promise<[GameHistory[], Date]> {
    const [yearStartDate, yearEndDate] = this.cronService.getCleanDateSpan_CurrentYear();
    const games = await this.#getAllGamesFromTimeSpan(yearStartDate, yearEndDate);
    return [games, yearStartDate];
  }

  async #getAllGamesFromTimeSpan(
    startDate: Date,
    endDate: Date
  ): Promise<GameHistory[]> {
    try {
      return await this.historyRepository.find({
        where: {
          createdAt: Between(startDate, endDate),
          gameFinished: true
        }
      })
    } catch(error) {
      handlePostgresError(error);
    }
  }
  
  async endGame(updateDto: UpdateGameHistoryDto): Promise<void> {
    if (!updateDto.id && (!updateDto.user || !updateDto.startedTime)) throw new BadRequestException('Invalid parameters!');

    const findDto: FindGameHistoryDto = {
      id: updateDto.id,
      user: updateDto.user,
      startedTime: updateDto.startedTime,
      withDeleted: false
    }

    let gameInProgress = await this.findOne(findDto);
    if (!gameInProgress) throw new NotFoundException('No game in progress found!');
    if (gameInProgress.gameFinished) throw new BadRequestException('Game is already finished!');

    gameInProgress.moves = updateDto.moves;
    gameInProgress.gameWon = updateDto.gameWon;
    gameInProgress.gameFinished = true;
    gameInProgress.finishedTime = updateDto.finishedTime;
    gameInProgress.gameDurationInSeconds = Math.floor((updateDto.finishedTime.getTime() - updateDto.startedTime.getTime()) / 1000);

    await this.update(gameInProgress);
    await this.#updateUserStats(gameInProgress);
  }
  
  async #updateUserStats(finishedGame: GameHistory): Promise<void> {
    const { user, gameFinished } = finishedGame;
    if (!gameFinished) throw new BadRequestException('Game not finished!');
    
    const findUserStatsDto: FindUserStatsDto = {
      user,
      withDeleted: false
    }
    const userStats = await this.statsService.findOne(findUserStatsDto);
    if (!userStats) throw new Error('Error finding user stats');

    userStats.averageSolveTime = (userStats.gamesPlayed * userStats.averageSolveTime + finishedGame.gameDurationInSeconds) / userStats.gamesPlayed + 1;
    userStats.fastestSolveTime = Math.min(userStats.fastestSolveTime, finishedGame.gameDurationInSeconds);
    userStats.gamesPlayed++;
    if (finishedGame.gameWon) userStats.gamesWon++;
    userStats.totalTimePlayed += finishedGame.gameDurationInSeconds;
  
    this.statsService.update(userStats);
  }

  async create(createUserDto: CreateGameHistoryDto): Promise<void> {
    if (!createUserDto.user || !createUserDto.startedTime) throw new BadRequestException('Invalid parameters!');

    const existingGame = await this.historyRepository.findOne({
      where: {
        user: createUserDto.user,
        startedTime: createUserDto.startedTime
      },
      withDeleted: true
    });
    if (existingGame) throw new ConflictException('This game already exists!');
    
    try {
      await this.historyRepository.save(createUserDto);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findAllForUser(user: User): Promise<GameHistory[]> {
    try {
      return await this.historyRepository.find({
        where: { user: user },
        withDeleted: false
      });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findAll(): Promise<GameHistory[]> {
    try {
      return await this.historyRepository.find({ withDeleted: false });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindGameHistoryDto): Promise<GameHistory> {
    const { id, user, startedTime, withDeleted } = findDto;
    let result: GameHistory | null = null;

    if (!id && (!user || !startedTime)) throw new BadRequestException('Invalid parameters');

    const where: any = { };
    if (id) where.id = id;
    if (user) where.user = user;
    if (startedTime) where.startedTime = startedTime;

    try {
      result = await this.historyRepository.findOne({
        where,
        withDeleted,
      });
    } catch(error) {
      handlePostgresError(error);
    }

    if (!result) throw new NotFoundException('Game not found');
    return result;
  }

  async update(updateDto: UpdateGameHistoryDto): Promise<void> {
    const { id, user, startedTime } = updateDto;
    if (!id && (!startedTime || user)) throw new BadRequestException('Invalid parameters');

    const findDto: FindGameHistoryDto = {
      id,
      user,
      startedTime,
      withDeleted: false
    }

    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No game to update found!');

    try {
      const result = await this.historyRepository.update(game.id, updateDto);
      if (result.affected <= 0) throw new BadRequestException('Game update failed!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveGameHistoryDto): Promise<void> {
    const findDto: FindGameHistoryDto = {
      id: removeDto.id,
      user: removeDto.user,
      startedTime: removeDto.startedTime,
      withDeleted: false
    }

    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No game to remove found!');

    try {
      await this.historyRepository.softRemove(game);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async restore(restoreDto: RemoveGameHistoryDto): Promise<void> {
    const findDto: FindGameHistoryDto = {
      id: restoreDto.id,
      user: restoreDto.user,
      startedTime: restoreDto.startedTime,
      withDeleted: true
    }
    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No game to restore found!');

    try {
      const result = await this.historyRepository.restore(game);
      if (result.affected > 0) throw new BadRequestException('Error restoring deleted game!');
    } catch(error) {
      handlePostgresError(error);
    }
  }
}
