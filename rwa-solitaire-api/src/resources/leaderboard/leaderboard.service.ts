import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { WeeklyLeaderboard } from "./entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "./entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "./entities/leaderboard-yearly.entity";
import { SolitaireHistory } from "../solitaire-history/entities/solitaire-history.entity";
import { UserData } from "../leaderboard/entities/userdata";
import { SolitaireHistoryService } from "../solitaire-history/solitaire-history.service";
import { UpdateLeaderboardDto } from "./dto/update-leaderboard.dto";
import { CronService } from "src/database/cron.service";

@Injectable()
export class LeaderboardService {
  
  constructor(
    private readonly historyService: SolitaireHistoryService,
    private readonly cron: CronService,

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
    const leaderboardDto = this.prepareUpsertDto(userData, timePeriod);

    return this.upsert(leaderboardDto, type);
  }

  async create(
    createLeaderboardDto: CreateLeaderboardDto,
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard
  ): Promise<boolean> {
    const leaderboard = new type();
    leaderboard.timePeriod = createLeaderboardDto.timePeriod;
    leaderboard.top20_averageTime = createLeaderboardDto.top20_averageTime;
    leaderboard.top20_bestTime = createLeaderboardDto.top20_bestTime;
    leaderboard.top20_gamesPlayed = createLeaderboardDto.top20_gamesPlayed;
    leaderboard.top20_numberOfMoves = createLeaderboardDto.top20_numberOfMoves;
    try {
      const existingLeaderboard = await this.findOne(null, createLeaderboardDto.timePeriod, type, false);
      if (existingLeaderboard) throw new ConflictException('Leaderboard already exists for this time period! | leaderboard.service.ts');

      await this.weeklyRepository.save(leaderboard);
      return true;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error creating leaderboard! | leaderboard.service.ts');
    }
  }

  async findOne(
    id: number | null = null,
    timePeriod: Date | null = null,
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard,
    withDeleted: boolean
  ): Promise<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard | null> {
    if (!id && !timePeriod) return null;

    const where: any = { }
    if (id) where.id = id;
    if (timePeriod) where.timePeriod = timePeriod;

    try {
      const repository = this.getRepository(type);
      const leaderboard = await repository.findOne({
        where,
        withDeleted: withDeleted
      })
      
      return leaderboard;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error finding leaderboard! | leaderboard.service.ts');
    }
  }

  async findAll(
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard,
    withDeleted: boolean
  ): Promise<WeeklyLeaderboard[] | MonthlyLeaderboard[] | YearlyLeaderboard[]> {
    
    try {
      const repository = this.getRepository(type);
      const leaderboards = await repository.find({
        withDeleted: withDeleted
      })
      
      return leaderboards;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error finding leaderboards! | leaderboard.service.ts');
    }
  }

  async upsert(
    data: UpdateLeaderboardDto,
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard
  ): Promise<boolean> {
    if (!data.timePeriod) return false;

    try {
      const repository = this.getRepository(type);
      await repository.upsert(data, { conflictPaths: ['timePeriod'] });
      return true;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error upserting leaderboard! | leaderboard.service.ts');
    }
  }

  async update(
    id: number | null = null,
    updateDto: UpdateLeaderboardDto,
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard,
  ): Promise<boolean> {
    if (!id && !updateDto.timePeriod) return false;

    const leaderboard = await this.findOne(id, updateDto.timePeriod, type, false);
    if (!leaderboard) return false;
    
    try {
      const repository = this.getRepository(type);
      const result = await repository.update(leaderboard.id, updateDto);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error updating leaderboard! | leaderboard.service.ts');
    }
  }

  async remove(
    id: number | null = null,
    timePeriod: Date | null = null,
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard
  ): Promise<boolean> {
    if (!id && !timePeriod) return false;
    
    const leaderboard = await this.findOne(id, timePeriod, type, false);
    if (!leaderboard) return false;
    
    try {
      const repository = this.getRepository(type);
      await repository.softRemove(leaderboard);
      return true;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error removing leaderboard! | leaderboard.service.ts');
    }

  }

  async restore(
    id: number | null = null,
    timePeriod: Date | null = null,
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard
  ): Promise<boolean> {
    if (!id && !timePeriod) return false;
    
    const leaderboard = await this.findOne(id, timePeriod, type, true);
    if (!leaderboard) return false;

    try {
      const repository = this.getRepository(type);
      await repository.restore(leaderboard);
      return true;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error restoring leaderboard! | leaderboard.service.ts');
    }
    
  }

  private prepareUserData(games: SolitaireHistory[]): UserData[] {    
    const userData = new Map<string, UserData>();
    
    games.forEach(game => {
      const username = game.user.username;
      
      if (!userData[username]) {
        userData[username] = {
          username,
          totalGames: 0,
          leastMoves: Number.MAX_SAFE_INTEGER,
          totalDuration: 0,
          bestTime: Number.MAX_SAFE_INTEGER,
          gamesWon: 0,
        };
      }

      const userStats = userData.get(username);
      userStats.totalGames++;
      if (game.gameWon) userStats.gamesWon++;
      userStats.leastMoves = Math.min(userStats.leastMoves, game.moves);
      userStats.totalDuration += game.gameDurationInSeconds;
      userStats.bestTime = Math.min(userStats.bestTime, game.gameDurationInSeconds);
    });
    
    return Array.from(userData.values());
  }

  private prepareUpsertDto(
    userData: UserData[], 
    timePeriod: Date
  ): UpdateLeaderboardDto {

    const top20_bestTime = [];
    const top20_averageTime = [];
    const top20_numberOfMoves = [];
    const top20_gamesPlayed = [];

    userData.forEach(user => {
      // Insert into bestTime ranking
      this.insertIntoTop20(top20_bestTime, user, (a, b) => a.bestTime - b.bestTime);
  
      // Insert into averageTime ranking
      this.insertIntoTop20(top20_averageTime, user, (a, b) => (a.totalDuration / a.totalGames) - (b.totalDuration / b.totalGames));
  
      // Insert into moveCount ranking
      this.insertIntoTop20(top20_numberOfMoves, user, (a, b) => a.leastMoves - b.leastMoves);
  
      // Insert into gamesPlayed ranking
      this.insertIntoTop20(top20_gamesPlayed, user, (a, b) => b.totalGames - a.totalGames);
    });

    return {
      top20_bestTime,
      top20_averageTime,
      top20_numberOfMoves,
      top20_gamesPlayed,
      timePeriod
    };
  }

  private insertIntoTop20(
    ranking: UserData[],
    user: UserData,
    comparator: (a: UserData, b: UserData) => number
  ): void {
    // Find the correct position for the current user in the ranking
    let inserted = false;
    for (let i = 0; i < ranking.length; i++) {
      if (comparator(user, ranking[i]) < 0) {
        ranking.splice(i, 0, user);
        inserted = true;
        break;
      }
    }
  
    // If user is not inserted and ranking has space, push to the end
    if (!inserted && ranking.length < 20) {
      ranking.push(user);
    }
  
    // Ensure ranking does not exceed 20 entries
    if (ranking.length > 20) {
      ranking.pop();
    }
  }

  private getRepository(
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard
  ): Repository<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard> | null {
    const repo = 
      type === WeeklyLeaderboard ? this.weeklyRepository :
      type === MonthlyLeaderboard ? this.monthlyRepository :
      type === YearlyLeaderboard ? this.yearlyRepository : null;

    if (!repo) throw new Error('Error finding repository! | leaderboard.service.ts');
    return repo;
  }
}