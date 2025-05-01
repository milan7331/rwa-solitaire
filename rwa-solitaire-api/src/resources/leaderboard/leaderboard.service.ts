import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { WeeklyLeaderboard } from "./entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "./entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "./entities/leaderboard-yearly.entity";
import { GameHistory } from "../game-history/entities/game-history.entity";
import { LeaderboardRow } from "./entities/leaderboard.row";
import { GameHistoryService } from "../game-history/game-history.service";
import { UpdateLeaderboardDto } from "./dto/update-leaderboard.dto";
import { handlePostgresError } from "src/util/postgres-error-handler";
import { FindLeaderboardDto } from "./dto/find-leaderboard.dto";
import { RemoveLeaderboardDto } from "./dto/remove-leaderboard.dto";
import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";
import { GetLeaderboardDto } from "./dto/get-leaderboard.dto";
import { Leaderboard } from "./entities/leaderboard.entity";
import { LeaderboardType } from "./entities/leaderboard.enum";

@Injectable()
export class LeaderboardService {
  
  constructor(
    @Inject(forwardRef(() => GameHistoryService))
    private readonly historyService: GameHistoryService,

    @InjectRepository(WeeklyLeaderboard)
    private readonly weeklyRepository: Repository<WeeklyLeaderboard>,

    @InjectRepository(MonthlyLeaderboard)
    private readonly monthlyRepository: Repository<MonthlyLeaderboard>,
    
    @InjectRepository(YearlyLeaderboard)
    private readonly yearlyRepository: Repository<YearlyLeaderboard>
  ) {}

  // method inserts new row or updates ongoing one. Used in the cron service 
  async leaderboardRefresh(leaderboardType: LeaderboardType): Promise<void> {
    const [allGames, timePeriod] =
      leaderboardType === LeaderboardType.WEEKLY ? await this.historyService.getAllGamesFromThisWeek() :
      leaderboardType === LeaderboardType.MONTHLY ? await this.historyService.getAllGamesFromThisMonth() :
      leaderboardType === LeaderboardType.YEARLY ? await this.historyService.getAllGamesFromThisYear() :
      [[], new Date()];
      if (allGames.length <= 0) return; // no games to update!

    const userData = this.#prepareUserData(allGames);
    const leaderboardDto = this.#prepareUpsertDto(userData, timePeriod, leaderboardType);

    this.upsert(leaderboardDto);
  }

  async loadLeaderboards(getDto: GetLeaderboardDto): Promise<Leaderboard[]> {
    const { leaderboardType, take, page } = getDto;
    
    const repo = this.#getRepository(leaderboardType);
    
    return this.#getLeaderboardPages(repo, take, page);
  }

  async create(createDto: CreateLeaderboardDto): Promise<void> {
    const { leaderboardType, timePeriod } = createDto;

    const isNotValidTime = isNaN(timePeriod.getTime());
    const isNotValidType = leaderboardType < 0 || leaderboardType > 2;

    if (isNotValidTime || isNotValidType) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      timePeriod,
      leaderboardType,
      withDeleted: false
    }
    const existingLeaderboard = await this.findOne(findDto);
    if (existingLeaderboard) throw new ConflictException('Leaderboard already exists for this time period!');
    
    const repository = this.#getRepository(leaderboardType);
    
    try {
      await repository.save(createDto);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindLeaderboardDto): Promise<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard> {
    const {id, timePeriod, leaderboardType, withDeleted } = findDto;
    let result = null;

    const isNotValidId = id === undefined;
    const isNotValidTime = isNaN(timePeriod.getTime());
    const isNotValidType = leaderboardType < 0 || leaderboardType > 2;

    if (isNotValidId && (isNotValidTime || isNotValidType)) throw new BadRequestException('Invalid parameters!');

    const where: any = { }
    if (!isNotValidId) where.id = id;
    if (!isNotValidTime) where.timePeriod = timePeriod;
    const repository = this.#getRepository(leaderboardType);

    try {
      result = await repository.findOne({
        where,
        withDeleted
      });
    } catch(error) {
      handlePostgresError(error);
    }

    if (!result) throw new NotFoundException('Leaderboard not found');
    return result;
  }

  async findAll(
    leaderboardType: LeaderboardType,
    withDeleted: boolean
  ): Promise<WeeklyLeaderboard[] | MonthlyLeaderboard[] | YearlyLeaderboard[]> {
    try {
      const repository = this.#getRepository(leaderboardType);
      return await repository.find({ withDeleted: withDeleted });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async upsert(updateDto: UpdateLeaderboardDto): Promise<void> {
    const { id, timePeriod, leaderboardType } = updateDto;

    const isNotValidId = id === undefined;
    const isNotValidTime = isNaN(timePeriod.getTime());
    const isNotValidType = leaderboardType < 0 || leaderboardType > 2;

    if (isNotValidId && (isNotValidTime || isNotValidType)) throw new BadRequestException('Invalid parameters!');

    const repository = this.#getRepository(leaderboardType);

    try {
      await repository.upsert(updateDto, { conflictPaths: ['timePeriod'] });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async update(updateDto: UpdateLeaderboardDto): Promise<void> {
    const { id, timePeriod, leaderboardType } = updateDto;

    const isNotValidId = id === undefined;
    const isNotValidTime = isNaN(timePeriod.getTime());
    const isNotValidType = leaderboardType < 0 || leaderboardType > 2;

    if (isNotValidId && (isNotValidTime || isNotValidType)) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      id,
      timePeriod,
      leaderboardType: leaderboardType,
      withDeleted: false
    }
    const leaderboard = await this.findOne(findDto);
    if (!leaderboard) throw new NotFoundException('Leaderboard update failed -> leaderboard not found!');

    const repository = this.#getRepository(leaderboardType);
    
    try {
      const result = await repository.update(leaderboard.id, updateDto);
      if (result.affected <= 0) throw new BadRequestException('Leaderboard update failed!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveLeaderboardDto): Promise<void> {
    const { id, timePeriod, leaderboardType } = removeDto;

    const isNotValidId = id === undefined;
    const isNotValidTime = isNaN(timePeriod.getTime());
    const isNotValidType = leaderboardType < 0 || leaderboardType > 2;

    if (isNotValidId && (isNotValidTime || isNotValidType)) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      id,
      timePeriod,
      leaderboardType,
      withDeleted: false
    }
    const leaderboard = await this.findOne(findDto);
    if (!leaderboard) throw new NotFoundException('Leaderboard update failed -> leaderboard not found!');
    
    const repository = this.#getRepository(leaderboardType);

    try {
      await repository.softRemove(leaderboard);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async restore(restoreDto: RemoveLeaderboardDto): Promise<void> {
    const { id, timePeriod, leaderboardType } = restoreDto;
    
    const isNotValidId = id === undefined;
    const isNotValidTime = isNaN(timePeriod.getTime());
    const isNotValidType = leaderboardType < 0 || leaderboardType > 2;

    if (isNotValidId && (isNotValidTime || isNotValidType)) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      id,
      timePeriod,
      leaderboardType,
      withDeleted: true
    }
    
    const leaderboard = await this.findOne(findDto);
    if (!leaderboard) throw new NotFoundException('Leaderboard update failed -> leaderboard not found!');

    const repository = this.#getRepository(leaderboardType);

    try {
      const result = await repository.restore(leaderboard);
      if (result.affected <= 0) throw new BadRequestException('Error restoring deleted leaderboard!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  #prepareUserData(games: GameHistory[]): LeaderboardRow[] {    
    const userData = new Map<string, LeaderboardRow>();
    
    games.forEach(game => {
      const username = game.user.username;
      
      if (!userData[username]) {
        userData[username] = {
          username,
          totalGames: 0,
          leastMoves: POSTGRES_MAX_INTEGER,
          totalDuration: 0,
          bestTime: POSTGRES_MAX_INTEGER,
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

  #prepareUpsertDto(
    userData: LeaderboardRow[], 
    timePeriod: Date,
    leaderboardType: LeaderboardType,
  ): UpdateLeaderboardDto {

    const top20_bestTime = [];
    const top20_averageTime = [];
    const top20_numberOfMoves = [];
    const top20_gamesPlayed = [];

    userData.forEach(user => {
      // Insert into bestTime ranking
      this.#insertIntoTop20(top20_bestTime, user, (a, b) => a.bestTime - b.bestTime);
  
      // Insert into averageTime ranking
      this.#insertIntoTop20(top20_averageTime, user, (a, b) => (a.totalDuration / a.totalGames) - (b.totalDuration / b.totalGames));
  
      // Insert into moveCount ranking
      this.#insertIntoTop20(top20_numberOfMoves, user, (a, b) => a.leastMoves - b.leastMoves);
  
      // Insert into gamesPlayed ranking
      this.#insertIntoTop20(top20_gamesPlayed, user, (a, b) => b.totalGames - a.totalGames);
    });

    return {
      top20_bestTime,
      top20_averageTime,
      top20_numberOfMoves,
      top20_gamesPlayed,
      timePeriod,
      leaderboardType
    };
  }

  #insertIntoTop20(
    ranking: LeaderboardRow[],
    user: LeaderboardRow,
    comparator: (a: LeaderboardRow, b: LeaderboardRow) => number
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

  #getRepository(leaderboardType: LeaderboardType): Repository<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard> {
    const repo = 
      leaderboardType === LeaderboardType.WEEKLY ? this.weeklyRepository :
      leaderboardType === LeaderboardType.MONTHLY ? this.monthlyRepository :
      leaderboardType === LeaderboardType.YEARLY ? this.yearlyRepository : null;

    if (!repo) throw new NotFoundException('Repository not found!');

    return repo;
  }

  async #getLeaderboardPageCount(repo: Repository<Leaderboard>): Promise<number> {
    try {
      return await repo.count();
    } catch(error) {
      handlePostgresError(error);
    }
  }
  
  async #getLeaderboardPages(
    repo: Repository<Leaderboard>,
    take: number = 10,
    page: number = 1
  ): Promise<Leaderboard[]> {
    if (!repo || take < 1) throw new BadRequestException('Invalid parameters!');
    
    const pageCount = await this.#getLeaderboardPageCount(repo);

    // pages are not zero based!
    let realPage = (page < 1) ? 1 : page;
    if (realPage > pageCount) realPage = pageCount;

    try {
      return await repo.find({
        order: {
          timePeriod: 'DESC'
        },
        skip: (realPage - 1) * take,
        take: take
      });
    } catch(error) {
      handlePostgresError(error);
    }
  }
}
