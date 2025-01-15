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

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory)
    private readonly historyRepository: Repository<GameHistory>,
    @Inject(forwardRef(() => CronService)) private readonly cronService: CronService,
    private readonly statsService: UserStatsService
  ) {}

  async getAllGamesFromThisWeek(): Promise<[GameHistory[], Date]> {
    const [weekStartDate, weekEndDate] = this.cronService.getCleanDateSpan_CurrentWeek();
    const games = await this.getAllGamesFromTimeSpan(weekStartDate, weekEndDate);
    return [games, weekStartDate];
  }
  
  async getAllGamesFromThisMonth(): Promise<[GameHistory[], Date]> {
    const [monthStartDate, monthEndDate] = this.cronService.getCleanDateSpan_CurrentMonth();
    const games = await this.getAllGamesFromTimeSpan(monthStartDate, monthEndDate);
    return [games, monthStartDate];
  }
  
  async getAllGamesFromThisYear(): Promise<[GameHistory[], Date]> {
    const [yearStartDate, yearEndDate] = this.cronService.getCleanDateSpan_CurrentYear();
    const games = await this.getAllGamesFromTimeSpan(yearStartDate, yearEndDate);
    return [games, yearStartDate];
  }


  private async getAllGamesFromTimeSpan(
    startDate: Date,
    endDate: Date
  ): Promise<GameHistory[]> {
    let results = [];
    try {
      results = await this.historyRepository.find({
        where: {
          createdAt: Between(startDate, endDate),
          gameFinished: true
        }
      })
    } catch(error) {
      handlePostgresError(error);
    }

    return results;
  }
  
  async startGame(startDto: CreateGameHistoryDto): Promise<boolean> {
    let newGame = await this.create(startDto);
    if (!newGame) throw new InternalServerErrorException('Error starting game!');

    return true;
  }
  
  async endGame(updateDto: UpdateGameHistoryDto): Promise<boolean> {
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

    const updated = await this.update(gameInProgress);
    if (!updated) throw new InternalServerErrorException('Error ending game!');

    const statsUpdated = await this.updateUserStats(gameInProgress);
    if (!statsUpdated) throw new InternalServerErrorException('Error updating user stats after game end!');

    return true;
  }
  
  async updateUserStats(finishedGame: GameHistory): Promise<boolean> {
    const { user, gameFinished } = finishedGame;
    if (!gameFinished) return false;
    
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
  
    return this.statsService.update(userStats);
  }

  async create(createUserDto: CreateGameHistoryDto): Promise<boolean> {
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

      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findAllForUser(user: User): Promise<GameHistory[]> {
    try {
      const games = await this.historyRepository.find({
        where: { user: user },
        withDeleted: false
      });
      return games;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findAll(): Promise<GameHistory[]> {
    try {
      const games = await this.historyRepository.find({ withDeleted: false });
      return games;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  findOne(findDto: FindGameHistoryDto): Promise<GameHistory | null> {
    const { id, user, startedTime, withDeleted } = findDto;

    if (!id && (!user || !startedTime)) throw new BadRequestException('Invalid parameters');

    const where: any = { };
    if (id) where.id = id;
    if (user) where.user = user;
    if (startedTime) where.startedTime = startedTime;

    try {
      const game = this.historyRepository.findOne({
        where,
        withDeleted,
      });

      return game;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async update(updateDto: UpdateGameHistoryDto): Promise<boolean> {
    const { id, user, startedTime, ...rest } = updateDto;
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
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveGameHistoryDto): Promise<boolean> {
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
      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async restore(restoreDto: RemoveGameHistoryDto): Promise<boolean> {
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
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      handlePostgresError(error);
    }
  }
}
