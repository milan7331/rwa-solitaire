import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, LessThan, Repository } from 'typeorm';

import { HashService } from './hash.service';
import { SavedGame } from '../saved-game/entities/saved-game.entity';
import { UserStats } from '../user-stats/entities/user-stats.entity';
import { GameHistory } from '../game-history/entities/game-history.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handlePostgresError } from 'src/util/postgres-error-handler';
import { FindUserDto } from './dto/find-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { POSTGRES_MAX_INTEGER } from 'src/util/postgres-constants';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly dataSource: DataSource,
    private readonly hashService: HashService,
  ) { }

  async isUsernameAvailable(username: string): Promise<void> {
    let user: User | null;

    try {
      user = await this.userRepository.findOne({
        where: { username },
        withDeleted: true,
        select: ['id'],
      });
    } catch(error) {
      handlePostgresError(error);
    }

    if (user) throw new BadRequestException('Username already in use!');
    return;
  }
  
  async isEmailAvailable(email: string): Promise<void> {
    let user: User | null;

    try {
      user = await this.userRepository.findOne({
        where: { email },
        withDeleted: true,
        select: ['id'],
      });
    } catch(error) {
      handlePostgresError(error);
    }

   if (user) throw new BadRequestException('Email already in use!');
   return;
  }

  async create(createDto: CreateUserDto): Promise<void> {
    const { email, username, password, firstname, lastname } = createDto;
    if (!email || !username || !password) throw new BadRequestException('Invalid parameters!');

    const findDto: FindUserDto = {
      email,
      username,
      withDeleted: true,
      withRelations: false
    }
    const existingUser = await this.findOne(findDto);
    if (existingUser) throw new ConflictException('Username or email already exists!');
    
    const passwordHash = await this.hashService.hashPassword(password);
    const newUser = this.userRepository.create({ username, email, passwordHash });

    const newStats = new UserStats();
    newStats.gamesPlayed = 0;
    newStats.gamesWon = 0;
    newStats.totalTimePlayed = 0;
    newStats.averageSolveTime = POSTGRES_MAX_INTEGER;
    newStats.fastestSolveTime = POSTGRES_MAX_INTEGER;

    const newGameHistory: GameHistory[] = [];

    const newSavedGame = new SavedGame();
    newSavedGame.gameState = {};

    if (firstname) newUser.firstname = firstname;
    if (lastname) newUser.lastname = lastname;
    newUser.userStats = newStats;
    newUser.gameHistory = newGameHistory;
    newUser.savedGame = newSavedGame;

    try {
      await this.userRepository.save(newUser);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindUserDto): Promise<User | null> {
    const { id, username, email, withDeleted, withRelations, password } = findDto;
    if (id === undefined && !username && !email) throw new BadRequestException('Invalid parameters!');
    let result = null;

    const where: any = { };
    if (id !== undefined) where.id = id;
    if (username) where.username = username;
    if (email) where.email = email;

    try {
      result = await this.userRepository.findOne({
        where,
        withDeleted,
        relations: withRelations ? ['gameHistory', 'userStats', 'savedGame'] : [],
      });
    } catch(error) {
      handlePostgresError(error);
    }

    // if password was provided, verify it before returning; works like a "more secure" version this way
    if (password && result) {
      const passwordValid = await this.hashService.verifyPassword(result.passwordHash, password);
      if (!passwordValid) throw new UnauthorizedException('User password doesnt match!');
    }

    if (result) result.passwordHash = '';

    return result;
  }

  async update(updateDto: UpdateUserDto): Promise<void> {
    const {id, email, username, password, newPassword, firstname, lastname } = updateDto;
    if (id === undefined) throw new BadRequestException('Invalid parameters!');

    const findDto: FindUserDto = {
      id,
      password,
      withDeleted: false,
      withRelations: false
    }

    const user = await this.findOne(findDto);
    if (!user)  throw new NotFoundException('User to update not found!');

    const update: DeepPartial<User>  = { }
    if (email) update.email = email;
    if (username) update.username = username;
    if (newPassword) update.passwordHash = await this.hashService.hashPassword(newPassword);
    if (firstname) update.firstname = firstname;
    if (lastname) update.lastname = lastname;

    try {
      const result = await this.userRepository.update(user.id, update);
      if (result.affected <= 0) throw new BadRequestException('Error updating user!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  // needs cleanup, chained removal not needed if cascades are set up
  async remove(removeDto: RemoveUserDto): Promise<void> {
    const { id, username, email, password} = removeDto;
    if (id === undefined && !username && !email) throw new BadRequestException('Invalid parameters');

    const findDto: FindUserDto = {
      id,
      username,
      email,
      password,
      withDeleted: false,
      withRelations: true
    }
    const user = await this.findOne(findDto);
    if (!user)  throw new NotFoundException('User to remove not found!');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.softRemove(user);
      await queryRunner.manager.softRemove(user.savedGame);
      await queryRunner.manager.softRemove(user.userStats);
      for (let i in user.gameHistory) {
        await queryRunner.manager.softRemove(user.gameHistory[i]);
      }
      await queryRunner.commitTransaction();
    } catch(error) {
      await queryRunner.rollbackTransaction();
      handlePostgresError(error);
    } finally {
      await queryRunner.release();
    }
  }

  // needs cleanup, chained restore not needed if cascades are set up
  async restore(restoreDto: RemoveUserDto): Promise<void> {
    const { id, username, email, password } = restoreDto;
    if (id === undefined && !username && !email) throw new BadRequestException('Invalid parameters');

    const findDto: FindUserDto = {
      id,
      username,
      email,
      password,
      withRelations: true,
      withDeleted: true
    }
    const user = await this.findOne(findDto);
    if (!user) throw new NotFoundException('User to restore not found!');
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      await queryRunner.manager.restore(User, user.id);
      await queryRunner.manager.restore(UserStats, user.userStats.id);
      await queryRunner.manager.restore(SavedGame, user.savedGame.id);
      for (let i in user.gameHistory) {
        await queryRunner.manager.restore(GameHistory, user.gameHistory[i].id);
      }
      await queryRunner.commitTransaction();
    } catch(error) {
      await queryRunner.rollbackTransaction();
      handlePostgresError(error);
    } finally {
      await queryRunner.release();
    }
  }
  
  async permanentlyRemoveOldUsers(): Promise<void> {
    const usersToRemove = await this.#findUsersForPermanentRemoval();
    if (usersToRemove.length <= 0) return;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i in usersToRemove) {
        await queryRunner.manager.remove(usersToRemove[i]);
        await queryRunner.manager.remove(usersToRemove[i].savedGame);
        await queryRunner.manager.remove(usersToRemove[i].userStats);
        for (let j in usersToRemove[i].gameHistory) {
          await queryRunner.manager.remove(usersToRemove[i].gameHistory[j]);
        }
      }
      await queryRunner.commitTransaction();
    } catch(error) {
      await queryRunner.rollbackTransaction();
      handlePostgresError(error);
    } finally {
      await queryRunner.release();
    }
  }

  async #findUsersForPermanentRemoval(): Promise<User[]> {
    const ThirtyDaysAgo = new Date();
    ThirtyDaysAgo.setDate(ThirtyDaysAgo.getDate() - 30);

    try {
      return await this.userRepository.find({
        withDeleted: true,
        where: { deletedAt: LessThan(ThirtyDaysAgo)},
        relations: ['GameHistory', 'UserStats', 'savedGame']
      });
    } catch(error) {
      handlePostgresError(error);
    }
  }
}