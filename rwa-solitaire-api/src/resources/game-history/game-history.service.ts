import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { GameHistory } from './entities/game-history.entity';
import { CreateGameHistoryDto } from './dto/create-game-history.dto';
import { UpdateGameHistoryDto } from './dto/update-game-history.dto';
import { UserStatsService } from '../user-stats/user-stats.service';
import { handlePostgresError } from 'src/util/postgres-error-handler';
import { FindGameHistoryDto } from './dto/find-game-history.dto';
import { RemoveGameHistoryDto } from './dto/remove-game-history.dto';
import { FindUserStatsDto } from '../user-stats/dto/find-user-stats.dto';
import { UserService } from '../user/user.service';
import { DateCalculationService } from 'src/util/date-calculation.service';
import { EndGameHistoryDto } from './dto/end-game-history.dto';

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory)
    private readonly historyRepository: Repository<GameHistory>,

    private readonly dateService: DateCalculationService,

    private readonly userService: UserService,
    private readonly statsService: UserStatsService,
  ) {}

  // used for leaderboard generation only
  async getAllGamesFromThisWeek(): Promise<[GameHistory[], Date]> {
    const [weekStartDate, weekEndDate] = this.dateService.getCleanDateSpan_CurrentWeek();
    const games = await this.#getAllGamesFromTimeSpan(weekStartDate, weekEndDate);
    return [games, weekStartDate];
  }

  // used for leaderboard generation only
  async getAllGamesFromThisMonth(): Promise<[GameHistory[], Date]> {
    const [monthStartDate, monthEndDate] = this.dateService.getCleanDateSpan_CurrentMonth();
    const games = await this.#getAllGamesFromTimeSpan(monthStartDate, monthEndDate);
    return [games, monthStartDate];
  }

  // used for leaderboard generation only
  async getAllGamesFromThisYear(): Promise<[GameHistory[], Date]> {
    const [yearStartDate, yearEndDate] = this.dateService.getCleanDateSpan_CurrentYear();
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
        },
        withDeleted: false,
        relations: ['user']
      })
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async create(createUserDto: CreateGameHistoryDto): Promise<void> {
    const { userId, gameDifficulty, startedTime } = createUserDto;
    this.#checkCreateGameParameters(userId, gameDifficulty, startedTime)

    const existingGame = await this.historyRepository.findOne({
      where: {
        user: { id: userId },
        startedTime,
      },
      withDeleted: true
    });
    if (existingGame) throw new ConflictException('This game already exists!');

    const user = await this.userService.findOne({
      id: userId,
      withDeleted: false,
      withRelations: false,
    });
    if (!user) throw new NotFoundException('User account required but not found!');

    try {
      await this.historyRepository.save({ user, startedTime, gameDifficulty } as GameHistory);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findAllForUser(username: string): Promise<GameHistory[]> {
    try {
      return await this.historyRepository.find({
        where: {
          user: { username: username }
        },
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

  async findOne(findDto: FindGameHistoryDto): Promise<GameHistory | null> {
    const { id, userId, startedTime, withDeleted, withRelations } = findDto;
    this.#checkGameParameters(id, userId, startedTime);

    let result: GameHistory | null = null;

    const where: any = { };
    if (id !== undefined) where.id = id;
    if (userId !== undefined) where.user = { id: userId };
    if (startedTime) where.startedTime = startedTime;

    try {
      result = await this.historyRepository.findOne({
        where,
        withDeleted,
        relations: withRelations ? ['user'] : []
      });
    } catch(error) {
      handlePostgresError(error);
    }

    return result;
  }

  async update(updateDto: UpdateGameHistoryDto): Promise<void> {
    const { id, userId, startedTime } = updateDto;
    this.#checkGameParameters(id, userId, startedTime);

    const findDto: FindGameHistoryDto = {
      id,
      userId,
      startedTime,
      withDeleted: false,
      withRelations: false
    }

    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No game to update found!');

    delete updateDto.userId;

    try {
      const result = await this.historyRepository.update(game.id, updateDto);
      if (result.affected <= 0) throw new BadRequestException('Game update failed!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async endGame(endDto: EndGameHistoryDto): Promise<void> {
    const { id, userId, startedTime } = endDto;
    this.#checkGameParameters(id, userId, startedTime);

    const findDto: FindGameHistoryDto = {
      id,
      userId,
      startedTime,
      withDeleted: false,
      withRelations: true,
    }
    let gameInProgress = await this.findOne(findDto);
    if (!gameInProgress) throw new NotFoundException('No game in progress found!');
    if (gameInProgress.gameFinished) throw new BadRequestException('Game is already finished!');

    gameInProgress.moves = endDto.moves;
    gameInProgress.gameWon = endDto.gameWon;
    gameInProgress.gameFinished = true;
    gameInProgress.finishedTime = endDto.finishedTime;
    gameInProgress.gameDurationInSeconds = Math.floor((endDto.finishedTime.getTime() - endDto.startedTime.getTime()) / 1000);

    const { user, ...updateDto } = gameInProgress;

    await this.update(updateDto);
    await this.#updateUserStats(gameInProgress);
  }

  async #updateUserStats(game: GameHistory): Promise<void> {
    const { user, gameFinished } = game;
    if (!gameFinished) throw new BadRequestException('Game not finished!');

    const findUserStatsDto: FindUserStatsDto = {
      userId: user.id,
      withDeleted: false
    }
    const userStats = await this.statsService.findOne(findUserStatsDto);
    if (!userStats) throw new Error('Error finding user stats');

    userStats.averageSolveTime = (userStats.gamesPlayed * userStats.averageSolveTime + game.gameDurationInSeconds) / userStats.gamesPlayed + 1;
    userStats.fastestSolveTime = Math.min(userStats.fastestSolveTime, game.gameDurationInSeconds);
    userStats.gamesPlayed++;
    if (game.gameWon) userStats.gamesWon++;
    userStats.totalTimePlayed += game.gameDurationInSeconds;

    this.statsService.update(userStats);
  }

  async remove(removeDto: RemoveGameHistoryDto): Promise<void> {
    const { id, startedTime, userId } = removeDto;
    this.#checkGameParameters(id, userId, startedTime);

    const findDto: FindGameHistoryDto = {
      id,
      userId,
      startedTime,
      withDeleted: false,
      withRelations: false
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
    const { id, startedTime, userId } = restoreDto;
    this.#checkGameParameters(id, userId, startedTime);

    const findDto: FindGameHistoryDto = {
      id,
      userId,
      startedTime,
      withDeleted: true,
      withRelations: false,
    }
    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No game to restore found!');

    try {
      const result = await this.historyRepository.restore(game.id);
      if (result.affected <= 0) throw new BadRequestException('Error restoring deleted game!');
    } catch(error) {
      handlePostgresError(error);
    }
  }


  #checkCreateGameParameters(userId: number, gameDifficulty: number, startedTime: Date): boolean {
    const isNotValidUserId = (userId === undefined || userId === null);
    const isNotValidDifficulty = (isNaN(gameDifficulty)) ? true : (gameDifficulty > 1 || gameDifficulty < 0);
    const isNotValidTime = (startedTime) ? isNaN(startedTime.getTime()) : true;

    if (isNotValidTime || isNotValidUserId || isNotValidDifficulty) throw new BadRequestException('Invalid parameters');

    return true;
  }

  #checkGameParameters(id: number, userId: number, startedTime: Date): boolean {
    const isNotValidId = (id === undefined || id === null);
    const isNotValidUserId = (userId === undefined || userId === null);
    const isNotValidTime = (startedTime) ? isNaN(startedTime.getTime()) : true;

    if (isNotValidId && (isNotValidTime || isNotValidUserId)) throw new BadRequestException('Invalid parameters');

    return true;
  }
}
