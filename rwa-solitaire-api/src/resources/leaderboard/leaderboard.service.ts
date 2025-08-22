import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { WeeklyLeaderboard } from "./entities/leaderboard-weekly.entity";
import { MonthlyLeaderboard } from "./entities/leaderboard-monthly.entity";
import { YearlyLeaderboard } from "./entities/leaderboard-yearly.entity";
import { GameHistory } from "../game-history/entities/game-history.entity";
import { UserData } from "./entities/userdata";
import { GameHistoryService } from "../game-history/game-history.service";
import { UpdateLeaderboardDto } from "./dto/update-leaderboard.dto";
import { handlePostgresError } from "src/util/postgres-error-handler";
import { FindLeaderboardDto } from "./dto/find-leaderboard.dto";
import { RemoveLeaderboardDto } from "./dto/remove-leaderboard.dto";
import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";
import { GetLeaderboardDto } from "./dto/get-leaderboard.dto";
import { Leaderboard } from "./entities/leaderboard.entity";
import { LeaderboardType } from "./entities/leaderboard.enum";
import { LeaderboardRow } from "./entities/leaderboard.row";

@Injectable()
export class LeaderboardService {

  constructor(
    private readonly historyService: GameHistoryService,

    @InjectRepository(WeeklyLeaderboard)
    private readonly weeklyRepository: Repository<WeeklyLeaderboard>,

    @InjectRepository(MonthlyLeaderboard)
    private readonly monthlyRepository: Repository<MonthlyLeaderboard>,

    @InjectRepository(YearlyLeaderboard)
    private readonly yearlyRepository: Repository<YearlyLeaderboard>,
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
    const { leaderboardType, take, skip } = getDto;

    const repo = this.#getRepository(leaderboardType);

    return this.#getLeaderboardPages(repo, take, skip);
  }

  async create(createDto: CreateLeaderboardDto): Promise<void> {
    const { leaderboardType, timePeriod } = createDto;
    this.#checkCreateLeaderboardParameters(leaderboardType, timePeriod);

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

  async findOne(findDto: FindLeaderboardDto): Promise<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard | null> {
    const {id, timePeriod, leaderboardType, withDeleted } = findDto;
    this.#checkLeaderboardParameters(id, timePeriod, leaderboardType);

    const where: any = { }
    if (id !== undefined) where.id = id;
    if (timePeriod) where.timePeriod = timePeriod;
    const repository = this.#getRepository(leaderboardType);

    try {
      return await repository.findOne({
        where,
        withDeleted
      });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async upsert(updateDto: UpdateLeaderboardDto): Promise<void> {
    const { id, timePeriod, leaderboardType } = updateDto;
    this.#checkLeaderboardParameters(id, timePeriod, leaderboardType);

    const repository = this.#getRepository(leaderboardType);

    try {
      await repository.upsert(updateDto, { conflictPaths: ['timePeriod'] });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async update(updateDto: UpdateLeaderboardDto): Promise<void> {
    const { id, timePeriod, leaderboardType, top20_averageTime, top20_bestTime, top20_gamesPlayed, top20_numberOfMoves } = updateDto;
    this.#checkLeaderboardParameters(id, timePeriod, leaderboardType);

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
      const result = await repository.update(leaderboard.id, { id, timePeriod, top20_averageTime, top20_bestTime, top20_gamesPlayed, top20_numberOfMoves });
      if (result.affected <= 0) throw new BadRequestException('Leaderboard update failed!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveLeaderboardDto): Promise<void> {
    const { id, timePeriod, leaderboardType } = removeDto;
    this.#checkLeaderboardParameters(id, timePeriod, leaderboardType);

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
    this.#checkLeaderboardParameters(id, timePeriod, leaderboardType);

    const findDto: FindLeaderboardDto = {
      id,
      timePeriod,
      leaderboardType,
      withDeleted: true
    }
    const leaderboard = await this.findOne(findDto);
    if (!leaderboard) throw new NotFoundException('Leaderboard update failed -> leaderboard not found!');
    console.log(leaderboard);

    const repository = this.#getRepository(leaderboardType);
    console.log(repository);

    try {
      const result = await repository.restore(leaderboard.id);
      if (result.affected <= 0) throw new BadRequestException('Error restoring deleted leaderboard!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  // groups the gamedata by user
  #prepareUserData(games: GameHistory[]): UserData[] {
    const userDataMap = new Map<string, UserData>();

    for (let game of games) {
      const username = game.user.username;

      if (!userDataMap.has(username)) {
        userDataMap.set(username, {
          username,
          totalGames: 0,
          leastMoves: POSTGRES_MAX_INTEGER,
          totalDuration: 0,
          bestTime: POSTGRES_MAX_INTEGER,
          gamesWon: 0,
        });
      }

      const userStats = userDataMap.get(username);
      userStats.totalGames++;
      if (game.gameWon) userStats.gamesWon++;
      userStats.leastMoves = Math.min(userStats.leastMoves, game.moves);
      userStats.totalDuration += game.gameDurationInSeconds;
      userStats.bestTime = Math.min(userStats.bestTime, game.gameDurationInSeconds);
    }

    return Array.from(userDataMap.values());
  }

  #prepareUpsertDto(
    userData: UserData[], 
    timePeriod: Date,
    leaderboardType: LeaderboardType,
  ): UpdateLeaderboardDto {

    const top20_bestTime: LeaderboardRow[] = [];
    const top20_averageTime: LeaderboardRow[] = [];
    const top20_numberOfMoves: LeaderboardRow[] = [];
    const top20_gamesPlayed: LeaderboardRow[] = [];

    userData.forEach(user => {
      // Insert into bestTime ranking
      this.#insertIntoTop20(top20_bestTime, { username: user.username, score: user.bestTime }, (a, b) => a.score - b.score);

      // Insert into averageTime ranking
      this.#insertIntoTop20(top20_averageTime, { username: user.username, score: this.#calculateAverage(user) }, (a, b) => a.score - b.score);

      // Insert into moveCount ranking
      this.#insertIntoTop20(top20_numberOfMoves, { username: user.username, score: user.leastMoves }, (a, b) => a.score - b.score);

      // Insert into gamesPlayed ranking
      this.#insertIntoTop20(top20_gamesPlayed, { username: user.username, score: user.totalGames }, (a, b) => b.score - a.score);
    });

    return {
      top20_bestTime,
      top20_averageTime,
      top20_numberOfMoves,
      top20_gamesPlayed,
      timePeriod,
      leaderboardType
    } as UpdateLeaderboardDto;
  }

  #insertIntoTop20(
    ranking: LeaderboardRow[],
    entry: LeaderboardRow,
    comparator: (a: LeaderboardRow, b: LeaderboardRow) => number
  ): void {
    // Find the correct position for the current user in the ranking
    let inserted = false;
    for (let i = 0; i < ranking.length; i++) {
      if (comparator(entry, ranking[i]) < 0) {
        ranking.splice(i, 0, entry);
        inserted = true;
        break;
      }
    }

    // If user is not inserted and ranking has space, push to the end
    if (!inserted && ranking.length < 20) {
      ranking.push(entry);
    }

    // Ensure ranking does not exceed 20 entries
    if (ranking.length > 20) {
      ranking.pop();
    }
  }

  #calculateAverage(user: UserData): number {
    return user.totalGames > 0 ? user.totalDuration / user.totalGames : POSTGRES_MAX_INTEGER;
  }

  #getRepository(leaderboardType: LeaderboardType): Repository<WeeklyLeaderboard | MonthlyLeaderboard | YearlyLeaderboard> {
    const repo =
      leaderboardType === LeaderboardType.WEEKLY ? this.weeklyRepository :
      leaderboardType === LeaderboardType.MONTHLY ? this.monthlyRepository :
      leaderboardType === LeaderboardType.YEARLY ? this.yearlyRepository : null;

    if (!repo) throw new NotFoundException('Repository not found!');

    return repo;
  }

  async #getLeaderboardCount(repo: Repository<Leaderboard>): Promise<number> {
    try {
      return await repo.count();
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async #getLeaderboardPages(
    repo: Repository<Leaderboard>,
    take: number = 10,
    skip: number = 0,
  ): Promise<Leaderboard[]> {
    if (!repo) throw new BadRequestException('Invalid parameters!');

    const count = await this.#getLeaderboardCount(repo);
    if (take + skip > count) skip = count - take;

    if (take < 1) take = 1;
    if (skip < 0) skip = 0;

    try {
      return await repo.find({
        order: {
          timePeriod: 'DESC'
        },
        skip: skip,
        take: take
      });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  #checkCreateLeaderboardParameters(leaderboardType: number, timePeriod: Date): boolean {
    const isNotValidType = (leaderboardType === undefined || leaderboardType === null) ? true : (leaderboardType < 0 || leaderboardType > 2);
    const isNotValidTime = (timePeriod) ? isNaN(timePeriod.getTime()) : true;

    if (isNotValidTime || isNotValidType) throw new BadRequestException('Invalid parameters!');

    return true;
  }

  #checkLeaderboardParameters(id: number, timePeriod: Date, leaderboardType: number): boolean {
    const isNotValidId = (id === undefined || id === null);
    const isNotValidTime = (timePeriod) ? isNaN(timePeriod.getTime()) : true;
    const isNotValidType = (leaderboardType === undefined || leaderboardType === null) ? true : (leaderboardType < 0 || leaderboardType > 2);

    if (isNotValidId && (isNotValidTime || isNotValidType)) throw new BadRequestException('Invalid parameters!');

    return true;
  }
}
