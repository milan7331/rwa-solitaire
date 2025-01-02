import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";


import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { WeeklyLeaderboard } from "./entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "./entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "./entities/leaderboard-yearly.entity";
import { SolitaireHistory } from "../solitaire-history/entities/solitaire-history.entity";
import { UserData } from "../leaderboard/entities/userdata";
import { CronService } from "src/database/cron.service";
import { SolitaireHistoryService } from "../solitaire-history/solitaire-history.service";
import { Leaderboard } from "./entities/leaderboard.entity";


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
  // used in the cron service so no error bubbling
  async WeeklyLeaderboardRefresh(): Promise<boolean> {
    const [allGames, timePeriod] = await this.historyService.getAllGamesFromThisWeek();
    if (allGames.length <= 0) return false;
    const userDataRecords = await this.prepareUserDataRecords(allGames);

    const weekly = new WeeklyLeaderboard();
    weekly.top20_averageTime = await this.getTop20_averageTime(userDataRecords);
    weekly.top20_bestTime = await this.getTop20_bestTime(userDataRecords);
    weekly.top20_gamesPlayed = await this.getTop20_gamesPlayed(userDataRecords);
    weekly.top20_numberOfMoves = await this.getTop20_moveCount(userDataRecords);
    weekly.timePeriod = timePeriod;

    try {
      await this.upsert(weekly, this.weeklyRepository);
      return true;
    } catch(error) {
      console.error(error.message);
    }

    return false;
  }

  // method inserts new weekly row or updates ongoing one
  // used in the cron service so no error bubbling
  async MonthlyLeaderboardRefresh(): Promise<boolean> {
    const [allGames, timePeriod] = await this.historyService.getAllGamesFromThisMonth();
    if (allGames.length <= 0) return false;
    const userDataRecords = await this.prepareUserDataRecords(allGames);

    const monthly = new MonthlyLeaderboard();
    monthly.top20_averageTime = await this.getTop20_averageTime(userDataRecords);
    monthly.top20_bestTime = await this.getTop20_bestTime(userDataRecords);
    monthly.top20_gamesPlayed = await this.getTop20_gamesPlayed(userDataRecords);
    monthly.top20_numberOfMoves = await this.getTop20_moveCount(userDataRecords);
    monthly.timePeriod = timePeriod;
    
    try {
      await this.upsert(monthly, this.monthlyRepository);
      return true;
    } catch(error) {
      console.error(error.message);
    }

    return false;
  }

  // method inserts new weekly row or updates ongoing one
  // used in the cron service so no error bubbling
  async YearlyLeaderboardRefresh(): Promise<boolean> {
    const [allGames, timePeriod] = await this.historyService.getAllGamesFromThisYear();
    if (allGames.length <= 0) return false;
    const userDataRecords = await this.prepareUserDataRecords(allGames);

    const yearly = new YearlyLeaderboard();
    yearly.top20_averageTime = await this.getTop20_averageTime(userDataRecords);
    yearly.top20_bestTime = await this.getTop20_bestTime(userDataRecords);
    yearly.top20_gamesPlayed = await this.getTop20_gamesPlayed(userDataRecords);
    yearly.top20_numberOfMoves = await this.getTop20_moveCount(userDataRecords);
    yearly.timePeriod = timePeriod;
    
    try {
      await this.upsert(yearly, this.yearlyRepository);  
      return true;
    } catch(error) {
      console.error(error.message);
    }

    return false;
  }

  async create(createLeaderboardDto: CreateLeaderboardDto) {
    return 'This action adds a new leaderboard';
  }
  
  async upsert(
    data: WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard,
    repository: Repository<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard>
  ): Promise<boolean> {
    try {
      await repository.upsert(data, { conflictPaths: ['timePeriod'] });
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Leaderboard Service | Error upserting leaderboard!');
    }
  }
  
  private async prepareUserDataRecords(games: SolitaireHistory[]) {    
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
    
    return userData;
  }
  
  private async getTop20_bestTime(userData: Record<string, UserData>): Promise<UserData[]> {
    const sortedData = Object.values(userData).sort((a, b) => a.bestTime - b.bestTime);

    return sortedData.slice(0, 20);
  }
  
  private async getTop20_averageTime(userData: Record<string, UserData>): Promise<UserData[]> {
    const sortedData = Object.values(userData).sort((a, b) => (a.totalDuration / a.totalGames) - (b.totalDuration / b.totalGames))
    
    return sortedData.slice(0, 20);
  }

  private async getTop20_moveCount(userData: Record<string, UserData>): Promise<UserData[]> {
    const sortedData = Object.values(userData).sort((a, b) => a.leastMoves - b.leastMoves);
    
    return sortedData.slice(0, 20);
  }

  private async getTop20_gamesPlayed(userData: Record<string, UserData>): Promise<UserData[]> {
    const sortedData = Object.values(userData).sort((a, b) => b.totalGames - a.totalGames);
    
    return sortedData.slice(0, 20);
  }
}