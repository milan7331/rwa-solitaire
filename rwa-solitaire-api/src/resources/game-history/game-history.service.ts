import { ConflictException, Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { SolitaireDifficulty, GameHistory } from './entities/game-history.entity';
import { CreateGameHistoryDto } from './dto/create-game-history.dto';
import { UpdateGameHistoryDto } from './dto/update-game-history.dto';
import { CronService } from 'src/database/cron.service';
import { UserStatsService } from '../user-stats/user-stats.service';

@Injectable()
export class GameHistoryService {
  constructor(
    @InjectRepository(GameHistory)
    private readonly historyRepository: Repository<GameHistory>,
    private readonly cronService: CronService,
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
      console.error('Error: ' + error);
      throw new Error('Error finding solitaire games from said timespan | game-history.service.ts');
    }

    return results;
  }
  
  async startGame(
    user: User,
    startedTime: Date,
    gameDifficulty: SolitaireDifficulty
  ): Promise<boolean> {
    let newGame = await this.create({user, startedTime, gameDifficulty} as CreateGameHistoryDto);
    if (!newGame) throw new Error('Error starting game! | game-history.service.ts');

    return true;
  }
  
  async endGame(
    updateDto: UpdateGameHistoryDto,
  ): Promise<boolean> {
    if (!updateDto.id && (!updateDto.user || !updateDto.startedTime)) return false;

    let gameInProgress = await this.findOne(updateDto.id, updateDto.user, updateDto.startedTime, false);
    if (!gameInProgress) throw new Error('No game in progress found! | game-history.service.ts');
    if (gameInProgress.gameFinished) throw new Error('Game is already finished! | game-history.service.ts');

    gameInProgress.moves = updateDto.moves;
    gameInProgress.gameWon = updateDto.gameWon;
    gameInProgress.gameFinished = true;
    gameInProgress.finishedTime = updateDto.finishedTime;
    gameInProgress.gameDurationInSeconds = Math.floor((updateDto.finishedTime.getTime() - updateDto.startedTime.getTime()) / 1000);

    const updated = await this.update(gameInProgress.id, gameInProgress);
    if (!updated) throw new Error('Error ending (updating) game! | game-history.service.ts');

    const statsUpdated = await this.updateUserStats(gameInProgress);
    if (!statsUpdated) throw new Error('Error updating user stats after game end! | game-history.service.ts');

    return true;
  }
  
  async updateUserStats(finishedGame: GameHistory): Promise<boolean> {
    if (!finishedGame.gameFinished) return false;
    const userStats = await this.statsService.findOne(null, finishedGame.user, false, false);
    if (!userStats) throw new Error('Error finding user stats | game-history.service.ts');

    userStats.averageSolveTime = (userStats.gamesPlayed * userStats.averageSolveTime + finishedGame.gameDurationInSeconds) / userStats.gamesPlayed + 1;
    userStats.fastestSolveTime = Math.min(userStats.fastestSolveTime, finishedGame.gameDurationInSeconds);
    userStats.gamesPlayed++;
    if (finishedGame.gameWon) userStats.gamesWon++;
    userStats.totalTimePlayed += finishedGame.gameDurationInSeconds;
  
    return this.statsService.update(userStats.id, finishedGame.user, userStats);
  }

  async create(createUserDto: CreateGameHistoryDto): Promise<boolean> {
    const existingGame = await this.historyRepository.findOne({
      where: {
        user: createUserDto.user,
        startedTime: createUserDto.startedTime
      }
    });
    if (existingGame) throw new ConflictException('This game already exists for this user!');
    
    try {
      await this.historyRepository.save(createUserDto);

      return true;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error creating solitaire-game | game-history.service.ts');
    }
  }

  async findAll(user: User): Promise<GameHistory[]> {
    let games = [];
    try {
      games = await this.historyRepository.find({
        where: { user: user }
      });
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error finding users solitaire history | game-history.service.ts');
    }

    return games;
  }

  findOne(
    id: number | null = null,
    user: User | null = null,
    startedTime: Date | null = null,
    withDeleted: boolean
  ): Promise<GameHistory | null> {
    if (!id && (!user || !startedTime)) return null;

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
        console.error('Error: ' + error);
        throw new Error('Error finding solitaire-game! | game-history.service.ts');
    }
  }

  async update(
    id: number,
    updateDto: UpdateGameHistoryDto
  ): Promise<boolean> {
    const game = await this.findOne(id, null, null, false);
    if (!game) throw new Error('No game to update found! | game-history.service.ts');

    try {
      const result = await this.historyRepository.update(id, updateDto);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error updating solitaire-game! | game-history.service.ts');
    }
  }

  async remove(
    id: number | null,
    user: User | null,
    startedTime: Date | null
  ): Promise<boolean> {
    const game = await this.findOne(id, user, startedTime, false);
    if (!game) throw new Error('No game to remove found! | game-history.service.ts');

    try {
      await this.historyRepository.softRemove(game);
      return true;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error softRemoving solitaire-game! | game-history.service.ts');
    }
  }

  async restore(
    id: number | null = null,
    user: User | null = null,
    startedTime: Date | null = null
  ): Promise<boolean> {
    const game = await this.findOne(id, user, startedTime, true);
    if (!game) throw new Error('No game to restore found! | game-history.service.ts');

    try {
      const result = await this.historyRepository.restore(game);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error restoring solitaire-game! | game-history.service.ts');
    }
  }
}
