import { ConflictException, Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../user/entities/user.entity';
import { SolitaireDifficulty, SolitaireHistory } from './entities/solitaire-history.entity';
import { CreateSolitaireHistoryDto } from './dto/create-solitaire-history.dto';
import { UpdateSolitaireHistoryDto } from './dto/update-solitaire-history.dto';
import { CronService } from 'src/database/cron.service';

@Injectable()
export class SolitaireHistoryService {
  constructor(
    @InjectRepository(SolitaireHistory)
    private readonly historyRepository: Repository<SolitaireHistory>,
    private readonly cronService: CronService
  ) {}

  async getAllGamesFromThisWeek(): Promise<[SolitaireHistory[], Date]> {
    const [weekStartDate, weekEndDate] = this.cronService.getCleanDateSpan_CurrentWeek();
    const games = await this.getAllGamesFromTimeSpan(weekStartDate, weekEndDate);
    return [games, weekStartDate];
  }
  
  async getAllGamesFromThisMonth(): Promise<[SolitaireHistory[], Date]> {
    const [monthStartDate, monthEndDate] = this.cronService.getCleanDateSpan_CurrentMonth();
    const games = await this.getAllGamesFromTimeSpan(monthStartDate, monthEndDate);
    return [games, monthStartDate];
  }
  
  async getAllGamesFromThisYear(): Promise<[SolitaireHistory[], Date]> {
    const [yearStartDate, yearEndDate] = this.cronService.getCleanDateSpan_CurrentYear();
    const games = await this.getAllGamesFromTimeSpan(yearStartDate, yearEndDate);
    return [games, yearStartDate];
  }


  private async getAllGamesFromTimeSpan(startDate: Date, endDate: Date): Promise<SolitaireHistory[]> {
    let results = [];
    try {
      results = await this.historyRepository.find({
        where: {
          createdAt: Between(startDate, endDate)
        }
      })
    } catch(error) {
      console.error(error.message);
      throw new Error('Error finding solitaire games from said timespan | solitaire-history.service.ts');
    }

    return results;
  }
  
  async startGame(user: User, startedTime: Date, difficulty: SolitaireDifficulty): Promise<boolean> {
    let newGame = await this.create(user, 0, false, false, difficulty, startedTime, null, 0);
    if (!newGame) throw new Error('Error starting game! | solitaire-history.service.ts');

    return true;
  }
  
  async endGame(
    user: User,
    startedTime: Date,
    moves: number,
    gameWon: boolean,
    finishedTime: Date
  ): Promise<boolean> {
    let gameInProgress = await this.findOne(null, user, startedTime, false);
    if (!gameInProgress) throw new Error('No game in progress found! | solitaire-history.service.ts');
    if (gameInProgress.gameFinished) throw new Error('Game is already finished! | solitaire-history.service.ts');

    gameInProgress.moves = moves;
    gameInProgress.gameWon = gameWon;
    gameInProgress.gameFinished = true;
    gameInProgress.finishedTime = finishedTime;
    gameInProgress.gameDurationInSeconds = Math.floor((finishedTime.getTime() - startedTime.getTime()) / 1000);

    let updated = await this.update(gameInProgress.id, gameInProgress);
    if (!updated) throw new Error('Error ending game! | solitaire-history.service.ts');

    return true;
  }

  async create(
    user: User,
    moves?: number,
    gameWon?: boolean,
    gameFinished?: boolean,
    gameDifficulty?: SolitaireDifficulty,
    startedTime?: Date,
    finishedTime?: Date,
    gameDurationInSeconds?: number,
  ): Promise<boolean> {
    let newGame = new SolitaireHistory();
    newGame.user = user;
    newGame.moves = moves ?? 0;
    newGame.gameWon = gameWon ?? false;
    newGame.gameFinished = gameFinished ?? false;
    newGame.gameDifficulty = gameDifficulty ?? SolitaireDifficulty.Hard;
    newGame.startedTime = startedTime ?? null;
    newGame.finishedTime = finishedTime ?? null;
    newGame.gameDurationInSeconds = gameDurationInSeconds ?? 0;

    try {
      const existingGame = await this.historyRepository.findOne({
        where: { user: user, startedTime: startedTime }
      });
      if (existingGame) throw new ConflictException('This game already exists for this user!');

      await this.historyRepository.save(newGame);
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error creating solitaire-game | solitaire-history.service.ts');
    }
  }

  async findAll(user: User): Promise<SolitaireHistory[]> {
    let games = [];
    try {
      games = await this.historyRepository.find({
        where: { user: user }
      });
    } catch(error) {
      console.error(error.message);
      throw new Error('Error finding users solitaire history | solitaire-history.service.ts');
    }

    return games;
  }

  findOne(id?: number, user?: User, startedTime?: Date, withDeleted?: boolean): Promise<SolitaireHistory | null> {
    if (!id && (!user || !startedTime)) return null;

    try {
      const game = this.historyRepository.findOne({
        where: {
          ...(id && { id }),
          ...(user && { user }),
          ...(startedTime && { startedTime }),
        },
        withDeleted: withDeleted,
      });

      return game;
      } catch(error) {
        console.error(error.message);
        throw new Error('Error finding solitaire-game! | solitaire-history.service.ts');
    }
  }

  async update(id: number, updateDto: UpdateSolitaireHistoryDto): Promise<boolean> {
    const game = await this.findOne(id, null, null, false);
    if (!game) throw new Error('No game to update found! | solitaire-history.service.ts');

    try {
      const result = await this.historyRepository.update(id, updateDto);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error updating solitaire-game! | solitaire-history.service.ts');
    }
  }

  async remove(id?: number, user?: User, startedTime?: Date): Promise<boolean> {
    const game = await this.findOne(id, user, startedTime, false);
    if (!game) throw new Error('No game to remove found! | solitaire-history.service.ts');

    try {
      await this.historyRepository.softRemove(game);
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error softRemoving solitaire-game! | solitaire-history.service.ts');
    }
  }

  async restore(id?: number, user?: User, startedTime?: Date): Promise<boolean> {
    const game = await this.findOne(id, user, startedTime, true);
    if (!game) throw new Error('No game to restore found! | solitaire-history.service.ts');

    try {
      const result = await this.historyRepository.restore(game);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error restoring solitaire-game! | solitaire-history.service.ts');
    }
  }
}
