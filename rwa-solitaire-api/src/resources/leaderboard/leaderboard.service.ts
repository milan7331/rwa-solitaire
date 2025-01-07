import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { WeeklyLeaderboard } from "./entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "./entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "./entities/leaderboard-yearly.entity";
import { SolitaireHistory } from "../solitaire-history/entities/solitaire-history.entity";
import { UserData } from "../leaderboard/entities/userdata";
import { CronService } from "src/database/cron.service";
import { SolitaireHistoryService } from "../solitaire-history/solitaire-history.service";
import { UpdateLeaderboardDto } from "./dto/update-leaderboard.dto";

@Injectable()
export class LeaderboardService {
  
  constructor(
    private readonly cronService: CronService,
    private readonly historyService: SolitaireHistoryService,

    @InjectRepository(WeeklyLeaderboard)
    private readonly weeklyRepository: Repository<WeeklyLeaderboard>,

    @InjectRepository(MonthlyLeaderboard)
    private readonly monthlyRepository: Repository<MonthlyLeaderboard>,
    
    @InjectRepository(YearlyLeaderboard)
    private readonly yearlyRepository: Repository<YearlyLeaderboard>
  ) { }

  // method inserts new weekly row or updates ongoing one
  // used in the cron service so theres no error bubbling
  async leaderboardRefresh(
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard
  ): Promise<boolean> {
    const [allGames, timePeriod] =
      type === WeeklyLeaderboard ? await this.historyService.getAllGamesFromThisWeek() :
      type === MonthlyLeaderboard ? await this.historyService.getAllGamesFromThisMonth() :
      type === YearlyLeaderboard ? await this.historyService.getAllGamesFromThisYear() : [[], new Date()];
      if (allGames.length <= 0) return false;

    const userData = this.prepareUserData(allGames);
    const leaderboardDto = {
      top20_averageTime: this.getTop20_averageTime(userData),
      top20_bestTime: this.getTop20_bestTime(userData),
      top20_gamesPlayed: this.getTop20_gamesPlayed(userData),
      top20_numberOfMoves: this.getTop20_moveCount(userData),
      timePeriod: timePeriod
    } as UpdateLeaderboardDto;

    try {
      await this.upsert(leaderboardDto, type);
      return true;
    } catch(error) {
      console.error(error.message);
    }

  }

  async create(
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard,
    createLeaderboardDto: CreateLeaderboardDto
  ): Promise<boolean> {
    const leaderboard = new type();
    leaderboard.timePeriod = createLeaderboardDto.timePeriod;
    leaderboard.top20_averageTime = createLeaderboardDto.top20_averageTime;
    leaderboard.top20_bestTime = createLeaderboardDto.top20_bestTime;
    leaderboard.top20_gamesPlayed = createLeaderboardDto.top20_gamesPlayed;
    leaderboard.top20_numberOfMoves = createLeaderboardDto.top20_numberOfMoves;
    try {
      const existingLeaderboard = await this.findOne(type, false, null, createLeaderboardDto.timePeriod);
      if (existingLeaderboard) throw new Error('Leaderboard already exists for this time period! | leaderboard.service.ts');

      await this.weeklyRepository.save(leaderboard);
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error creating leaderboard! | leaderboard.service.ts');
    }
  }

  async findOne(
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard,
    withDeleted: boolean,
    id?: number,
    timePeriod?: Date
  ): Promise<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard | null> {
    if (!id && !timePeriod) throw new Error('Error finding leaderboard! | leaderboard.service.ts');

    const repository =
      type === WeeklyLeaderboard ? this.weeklyRepository :
      type === MonthlyLeaderboard ? this.monthlyRepository :
      type === YearlyLeaderboard ? this.yearlyRepository : null;

    if (!repository) throw new Error('Error finding leaderboard! | leaderboard.service.ts');

    try {
      const leaderboard = await repository.findOne({
        where: {
          ...(id && { id: id }),
          ...(timePeriod && { timePeriod: timePeriod })
        },
        withDeleted: withDeleted
      })
      
      return leaderboard;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error finding leaderboard! | leaderboard.service.ts');
    }
  }

  async findAll(
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard,
    withDeleted: boolean
  ): Promise<WeeklyLeaderboard[] | MonthlyLeaderboard[] | YearlyLeaderboard[]> {
    const repository =
      type === WeeklyLeaderboard ? this.weeklyRepository :
      type === MonthlyLeaderboard ? this.monthlyRepository :
      type === YearlyLeaderboard ? this.yearlyRepository : null;

    if (!repository) throw new Error('Error finding leaderboards! | leaderboard.service.ts');

    try {
      const leaderboards = await repository.find({
        withDeleted: withDeleted
      })
      
      return leaderboards;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error finding leaderboards! | leaderboard.service.ts');
    }
  }

  async upsert(
    data: UpdateLeaderboardDto,
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard
  ): Promise<boolean> {

    const repository =
      type === WeeklyLeaderboard ? this.weeklyRepository :
      type === MonthlyLeaderboard ? this.monthlyRepository :
      type === YearlyLeaderboard ? this.yearlyRepository : null;
    if (!repository) throw new Error('Error finding repository for upserting a leaderboard! | leaderboard.service.ts');

    try {
      await repository.upsert(data, { conflictPaths: ['timePeriod'] });
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error upserting leaderboard! | leaderboard.service.ts');
    }
  }

  async update(
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard,
    updateDto: UpdateLeaderboardDto,
    id?: number,
  ): Promise<boolean> {
    if (!id && !updateDto.timePeriod) throw new Error('Error finding leaderboard to update! | leaderboard.service.ts');

    const repository =
      type === WeeklyLeaderboard ? this.weeklyRepository :
      type === MonthlyLeaderboard ? this.monthlyRepository :
      type === YearlyLeaderboard ? this.yearlyRepository : null;
    if (!repository) throw new Error('Error finding repository for updating a leaderboard! | leaderboard.service.ts');

    try {
      const leaderboard = await this.findOne(type, false, id, updateDto.timePeriod);
      if (!leaderboard) throw new Error('No leaderboard to update found! | leaderboard.service.ts');

      await repository.update(leaderboard.id, updateDto);
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error updating leaderboard! | leaderboard.service.ts');
    }
  }

  async remove(id?: number, timePeriod?: Date): Promise<boolean> {
    if (!id && !timePeriod) throw new Error('Error finding leaderboard to delete! | leaderboard.service.ts');

    try {
      const weeklyLeaderboard = await this.findOne(WeeklyLeaderboard, false, id, timePeriod);
      if (!weeklyLeaderboard) throw new Error('No leaderboard to remove found! | leaderboard.service.ts');

      await this.weeklyRepository.softRemove(weeklyLeaderboard);
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error removing leaderboard! | leaderboard.service.ts');
    }

  }

  async restore(id?: number, timePeriod?: Date): Promise<boolean> {
    if (!id && !timePeriod) throw new Error('Error finding leaderboard to restore! | leaderboard.service.ts');

    try {
      const weeklyLeaderboard = await this.findOne(WeeklyLeaderboard, true, id, timePeriod);
      if (!weeklyLeaderboard) throw new Error('No leaderboard to restore found! | leaderboard.service.ts');

      await this.weeklyRepository.restore(weeklyLeaderboard);
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error restoring leaderboard! | leaderboard.service.ts');
    }
    
  }

  private prepareUserData(games: SolitaireHistory[]): UserData[] {    
    const userData: Record<string, UserData> = {};
    
    games.forEach(game => {
      const username = game.user.username;
      
      if (!userData[username]) {
        userData[username] = {
          username,
          totalGames: 0,
          leastMoves: Infinity,
          totalDuration: 0,
          bestTime: Infinity,
          gamesWon: 0,
        };
      }

      const userStats = userData[username];
      userStats.totalGames++;
      if (game.gameWon) userStats.gamesWon++;
      if (game.moves < userStats.leastMoves) userStats.leastMoves = game.moves;
      userStats.totalDuration += game.gameDurationInSeconds;
      if (game.gameDurationInSeconds < userStats.bestTime) userStats.bestTime = game.gameDurationInSeconds;
    });
    
    return Object.values(userData);
  }
  
  private getTop20_bestTime(userData: UserData[]): UserData[] {
    return userData
      .sort((a, b) => a.bestTime - b.bestTime)
      .slice(0, 20);
  }
  
  private getTop20_averageTime(userData: UserData[]): UserData[] {
    return userData
      .sort((a, b) => (a.totalDuration / a.totalGames) - (b.totalDuration / b.totalGames))
      .slice(0, 20);
  }

  private getTop20_moveCount(userData: UserData[]): UserData[] {
    return userData
      .sort((a, b) => a.leastMoves - b.leastMoves)
      .slice(0, 20);
  }

  private getTop20_gamesPlayed(userData: UserData[]): UserData[] {
    return userData
      .sort((a, b) => b.totalGames - a.totalGames)
      .slice(0, 20);
  }
}