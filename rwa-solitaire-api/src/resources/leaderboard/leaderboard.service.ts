import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { WeeklyLeaderboard } from "./entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "./entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "./entities/leaderboard-yearly.entity";
import { GameHistory } from "../game-history/entities/game-history.entity";
import { UserData } from "../leaderboard/entities/userdata";
import { GameHistoryService } from "../game-history/game-history.service";
import { UpdateLeaderboardDto } from "./dto/update-leaderboard.dto";
import { CronService } from "src/util/cron.service";
import { handlePostgresError } from "src/util/postgres-error-handler";
import { FindLeaderboardDto } from "./dto/find-leaderboard.dto";
import { RemoveLeaderboardDto } from "./dto/remove-leaderboard.dto";

@Injectable()
export class LeaderboardService {
  
  constructor(
    private readonly historyService: GameHistoryService,

    @InjectRepository(WeeklyLeaderboard)
    private readonly weeklyRepository: Repository<WeeklyLeaderboard>,

    @InjectRepository(MonthlyLeaderboard)
    private readonly monthlyRepository: Repository<MonthlyLeaderboard>,
    
    @InjectRepository(YearlyLeaderboard)
    private readonly yearlyRepository: Repository<YearlyLeaderboard>
  ) { }

  // method inserts new weekly row or updates ongoing one used in the cron service
  async leaderboardRefresh(type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard): Promise<boolean> {
    const [allGames, timePeriod] =
      type === WeeklyLeaderboard ? await this.historyService.getAllGamesFromThisWeek() :
      type === MonthlyLeaderboard ? await this.historyService.getAllGamesFromThisMonth() :
      type === YearlyLeaderboard ? await this.historyService.getAllGamesFromThisYear() : [[], new Date()];
      if (allGames.length <= 0) return false;

    const userData = this.prepareUserData(allGames);
    const leaderboardDto = this.prepareUpsertDto(userData, timePeriod, type);

    return this.upsert(leaderboardDto);
  }

  async create(createDto: CreateLeaderboardDto): Promise<boolean> {
    const { type, timePeriod, ...rest } = createDto;
    if (!type || !timePeriod) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      timePeriod,
      type,
      withDeleted: false
    }
    const repository = this.getRepository(createDto.type);
    const existingLeaderboard = await this.findOne(findDto);
    if (existingLeaderboard) throw new ConflictException('Leaderboard already exists for this time period!');
    
    try {
      await repository.save(createDto);

      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindLeaderboardDto): Promise<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard | null> {
    const {id, timePeriod, type, withDeleted } = findDto;
    if (!type || (!id && !timePeriod)) throw new BadRequestException('Invalid parameters');

    const where: any = { }
    if (id) where.id = id;
    if (timePeriod) where.timePeriod = timePeriod;
    const repository = this.getRepository(type);

    try {
      const leaderboard = await repository.findOne({
        where,
        withDeleted
      });

      return leaderboard;
    } catch(error) {
      handlePostgresError(error);
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
      handlePostgresError(error);
    }
  }

  async upsert(updateDto: UpdateLeaderboardDto): Promise<boolean> {
    if (!updateDto.timePeriod || !updateDto.type) throw new BadRequestException('Invalid parameters!');
    const repository = this.getRepository(updateDto.type);

    try {
      await repository.upsert(updateDto, { conflictPaths: ['timePeriod'] });
      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async update(updateDto: UpdateLeaderboardDto): Promise<boolean> {
    if (!updateDto.timePeriod || !updateDto.type) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      id: updateDto.id,
      timePeriod: updateDto.timePeriod,
      type: updateDto.type,
      withDeleted: false
    }
    const leaderboard = await this.findOne(findDto);
    if (!leaderboard) throw new NotFoundException('Leaderboard update failed -> leaderboard not found!');
    const repository = this.getRepository(updateDto.type);
    
    try {
      const result = await repository.update(leaderboard.id, updateDto);

      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveLeaderboardDto): Promise<boolean> {
    const { id, timePeriod, type} = removeDto;
    if (!type || (!id && !timePeriod)) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      id,
      timePeriod,
      type,
      withDeleted: false
    }
    const leaderboard = await this.findOne(findDto);
    if (!leaderboard) throw new NotFoundException('Leaderboard update failed -> leaderboard not found!');
    const repository = this.getRepository(type);

    try {
      await repository.softRemove(leaderboard);

      return true;
    } catch(error) {
      handlePostgresError(error);
    }

  }

  async restore(restoreDto: RemoveLeaderboardDto): Promise<boolean> {
    const { id, timePeriod, type } = restoreDto;
    if (!type || (!id && !timePeriod)) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      id,
      timePeriod,
      type,
      withDeleted: true
    }
    
    const leaderboard = await this.findOne(findDto);
    if (!leaderboard) throw new NotFoundException('Leaderboard update failed -> leaderboard not found!');
    const repository = this.getRepository(type);

    try {
      await repository.restore(leaderboard);

      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  private prepareUserData(games: GameHistory[]): UserData[] {    
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
    timePeriod: Date,
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard,
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
      timePeriod,
      type
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
  ): Repository<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard> {
    const repo = 
      type === WeeklyLeaderboard ? this.weeklyRepository :
      type === MonthlyLeaderboard ? this.monthlyRepository :
      type === YearlyLeaderboard ? this.yearlyRepository : null;

    if (!repo) throw new NotFoundException('Repository not found!');

    return repo;
  }
}