import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, LessThan, Repository } from 'typeorm';

import { HashService } from 'src/auth/hash.service';
import { SavedGame } from '../saved-game/entities/saved-game.entity';
import { UserStats } from '../user-stats/entities/user-stats.entity';
import { GameHistory } from '../game-history/entities/game-history.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    @InjectRepository(SavedGame)
    private readonly savedGameRepository:Repository<SavedGame>,
    @InjectRepository(UserStats)
    private readonly statsRepository:Repository<UserStats>,
    @InjectRepository(GameHistory)
    private readonly historyRepository:Repository<GameHistory>,
    private readonly dataSource: DataSource,
    private readonly hashService: HashService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    const { email, username, password } = createUserDto;
    const existingUser = await this.findOne(username, email, null, false, false);
    if (existingUser) throw new ConflictException('Username or email already exists!');
    
    const passwordHash = await this.hashService.hashPassword(password);
    const newUser = this.userRepository.create({ username, email, passwordHash });

    try {
      await this.userRepository.save(newUser);
      return true;
    } catch(error) {
        console.error('Error: ' + error);
        throw new Error('Error creating user! | user.service.ts');
    }
  }
  
  async findOne(
    username: string | null = null,
    email: string | null = null,
    plainPassword: string | null = null,
    withDeleted: boolean = false,
    withRelations: boolean = false
  ): Promise<User | null> {
    if (!username && !email) return null;

    const where: any = { };
    if (username) where.username = username;
    if (email) where.email = email;

    try {
      const user = await this.userRepository.findOne({
        withDeleted,
        where,
        relations: withRelations ? ['GameHistory', 'UserStats', 'savedGame'] : [],
      });
      
      // if plainPassword was provided, verify it before returning
      // works like a "secure" version this way
      if (!plainPassword) return user;
      if (await this.hashService.verifyPassword(plainPassword, user.passwordHash)) return user;
      return null;

    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error finding one user! | user.service.ts');
    }
  }

  async update(
    username:string,
    plainPassword: string,
    updateUserDto: UpdateUserDto
  ): Promise<boolean> {
    try {
      const user = await this.findOne(username, null, plainPassword, false, false);
      if (!user) return false;

      const result = await this.userRepository.update(username, updateUserDto);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Failed to update user! | user.service.ts');
    }
  }

  async remove(
    username: string,
    email: string,
    plainPassword: string
  ): Promise<boolean> {
    const user = await this.findOne(username, email, plainPassword, false, true);
    if (!user) return false;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.softRemove(user);
      await queryRunner.manager.softRemove(user.savedGame);
      await queryRunner.manager.softRemove(user.UserStats);
      for (let i in user.GameHistory) {
        await queryRunner.manager.softRemove(user.GameHistory[i]);
      }

      await queryRunner.commitTransaction();
      return true;
    } catch(error) {
      await queryRunner.rollbackTransaction();
      console.error('Error: ' + error);
      throw new Error('Error trying to soft remove user! | user.service.ts');
    } finally {
      await queryRunner.release();
    }
  }

  async restore(
    username: string,
    email: string,
    plainPassword: string
  ): Promise<boolean> {
    const user = await this.findOne(username, email, plainPassword, true, true);
    if (!user) return false;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      await queryRunner.manager.restore(User, user.id);
      await queryRunner.manager.restore(UserStats, user.UserStats.id);
      await queryRunner.manager.restore(SavedGame, user.savedGame.id);
      for (let i in user.GameHistory) {
        await queryRunner.manager.restore(GameHistory, user.GameHistory[i].id);
      }

      await queryRunner.commitTransaction();
      return true;
    } catch(error) {
      await queryRunner.rollbackTransaction();
      console.error('Error: ' + error);
      throw new Error('Error trying to restore user and related entities! | user.service.ts');
    } finally {
      await queryRunner.release();
    }
  }
  
  async permanentlyRemoveOldUsers(): Promise<number> {
    const usersToRemove = await this.findUsersForPermanentRemoval();
    if (usersToRemove.length <= 0) return 0;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i in usersToRemove) {
        await queryRunner.manager.remove(usersToRemove[i]);
        await queryRunner.manager.remove(usersToRemove[i].savedGame);
        await queryRunner.manager.remove(usersToRemove[i].UserStats);
        for (let j in usersToRemove[i].GameHistory) {
          await queryRunner.manager.remove(usersToRemove[i].GameHistory[j]);
        }
      }

      await queryRunner.commitTransaction();
      return usersToRemove.length;
    } catch(error) {
      await queryRunner.rollbackTransaction();
      console.error('Error: ' + error);
      throw new Error('Error during old user cleanup! | user.service.ts');
    } finally {
      await queryRunner.release();
    }
  }

  private async findUsersForPermanentRemoval(): Promise<User[]> {
    let usersToRemove: User[] = [];
    const ThirtyDaysAgo = new Date();
    ThirtyDaysAgo.setDate(ThirtyDaysAgo.getDate() - 30);

    try {
      usersToRemove = await this.userRepository.find({
        withDeleted: true,
        where: { deletedAt: LessThan(ThirtyDaysAgo)},
        relations: ['GameHistory', 'UserStats', 'savedGame']
      });
      
      return usersToRemove;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error finding soft deleted user accounts! | user.service.ts');
    }
  }
}