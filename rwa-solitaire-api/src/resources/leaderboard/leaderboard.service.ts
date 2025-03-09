import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, NotFoundException } from "@nestjs/common";
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
import { handlePostgresError } from "src/util/postgres-error-handler";
import { FindLeaderboardDto } from "./dto/find-leaderboard.dto";
import { RemoveLeaderboardDto } from "./dto/remove-leaderboard.dto";
import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";
import { GetLeaderboardDto } from "./dto/get-leaderboard.dto";
import { Leaderboard } from "./entities/leaderboard.entity";

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
  async leaderboardRefresh(type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard): Promise<void> {
    const [allGames, timePeriod] =
      type === WeeklyLeaderboard ? await this.historyService.getAllGamesFromThisWeek() :
      type === MonthlyLeaderboard ? await this.historyService.getAllGamesFromThisMonth() :
      type === YearlyLeaderboard ? await this.historyService.getAllGamesFromThisYear() :
      [[], new Date()];
      if (allGames.length <= 0) return; // no games to update!

    const userData = this.#prepareUserData(allGames);
    const leaderboardDto = this.#prepareUpsertDto(userData, timePeriod, type);

    this.upsert(leaderboardDto);
  }

  // dto used only for class validation
  async loadLeaderboards(getDto: GetLeaderboardDto): Promise<Leaderboard[]> {
    const { type, take, page } = getDto;
    
    const repo = this.#getRepository(type);
    
    return this.#getLeaderboardPages(repo, take, page);
  }

  async create(createDto: CreateLeaderboardDto): Promise<void> {
    const { type, timePeriod } = createDto;
    if (!type || !timePeriod) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      timePeriod,
      type,
      withDeleted: false
    }
    const repository = this.#getRepository(createDto.type);
    const existingLeaderboard = await this.findOne(findDto);
    if (existingLeaderboard) throw new ConflictException('Leaderboard already exists for this time period!');
    
    try {
      await repository.save(createDto);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindLeaderboardDto): Promise<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard> {
    const {id, timePeriod, type, withDeleted } = findDto;
    let result = null;

    if (!type || (!id && !timePeriod)) throw new BadRequestException('Invalid parameters');

    const where: any = { }
    if (id) where.id = id;
    if (timePeriod) where.timePeriod = timePeriod;
    const repository = this.#getRepository(type);

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
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard,
    withDeleted: boolean
  ): Promise<WeeklyLeaderboard[] | MonthlyLeaderboard[] | YearlyLeaderboard[]> {
    try {
      const repository = this.#getRepository(type);
      return await repository.find({ withDeleted: withDeleted });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async upsert(updateDto: UpdateLeaderboardDto): Promise<void> {
    if (!updateDto.timePeriod || !updateDto.type) throw new BadRequestException('Invalid parameters!');
    const repository = this.#getRepository(updateDto.type);

    try {
      await repository.upsert(updateDto, { conflictPaths: ['timePeriod'] });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async update(updateDto: UpdateLeaderboardDto): Promise<void> {
    if (!updateDto.timePeriod || !updateDto.type) throw new BadRequestException('Invalid parameters!');

    const findDto: FindLeaderboardDto = {
      id: updateDto.id,
      timePeriod: updateDto.timePeriod,
      type: updateDto.type,
      withDeleted: false
    }
    const leaderboard = await this.findOne(findDto);
    if (!leaderboard) throw new NotFoundException('Leaderboard update failed -> leaderboard not found!');
    const repository = this.#getRepository(updateDto.type);
    
    try {
      const result = await repository.update(leaderboard.id, updateDto);
      if (result.affected <= 0) throw new BadRequestException('Leaderboard update failed!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveLeaderboardDto): Promise<void> {
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
    const repository = this.#getRepository(type);

    try {
      await repository.softRemove(leaderboard);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async restore(restoreDto: RemoveLeaderboardDto): Promise<void> {
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
    const repository = this.#getRepository(type);

    try {
      const result = await repository.restore(leaderboard);
      if (result.affected <= 0) throw new BadRequestException('Error restoring deleted leaderboard!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  #prepareUserData(games: GameHistory[]): UserData[] {    
    const userData = new Map<string, UserData>();
    
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
      type
    };
  }

  #insertIntoTop20(
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

  #getRepository(
    type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard
  ): Repository<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard> {
    const repo = 
      type === WeeklyLeaderboard ? this.weeklyRepository :
      type === MonthlyLeaderboard ? this.monthlyRepository :
      type === YearlyLeaderboard ? this.yearlyRepository : null;

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
  
  async #getLeaderboardPages(repo: Repository<Leaderboard>, take: number = 10, page: number = 1): Promise<Leaderboard[]> {
    if (!repo || take < 1) throw new BadRequestException('Invalid parameters!');
    
    const pageCount = await this.#getLeaderboardPageCount(repo);

    // pages are not zero based!
    let realPage = (!page || page < 1) ? 1 : page;
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
