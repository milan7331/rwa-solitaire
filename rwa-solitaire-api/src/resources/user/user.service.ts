import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, LessThan, Repository } from 'typeorm';

import { HashService } from 'src/auth/hash.service';
import { SavedGame } from '../saved-game/entities/saved-game.entity';
import { SolitaireStats } from '../solitaire-stats/entities/solitaire-stats.entity';
import { SolitaireHistory } from '../solitaire-history/entities/solitaire-history.entity';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository:Repository<User>,
    @InjectRepository(SavedGame)
    private savedGameRepository:Repository<SavedGame>,
    @InjectRepository(SolitaireStats)
    private statsRepository:Repository<SolitaireStats>,
    @InjectRepository(SolitaireHistory)
    private historyRepository:Repository<SolitaireHistory>,
    private dataSource: DataSource,
    private hashService: HashService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    const { email, username, password } = createUserDto;
    const existingUser = await this.findUser(username, email, null, false, false);
    if (existingUser) throw new ConflictException('Username or email already exists!');
    
    const passwordHash = await this.hashService.hashPassword(password);
    const newUser = this.userRepository.create({ username, email, passwordHash });

    try {
      const result = await this.userRepository.save(newUser);
      return true;
    } catch(error) {
        console.error(error.message);
        throw new Error('Error creating user! | user.service.ts');
    }
  }
  
  async findUser(
    username?: string,
    email?: string,
    plainPassword?: string,
    deleted: boolean = false,
    withRelations: boolean = false
  ): Promise<User | null> {
    let user: User | null = null;
    if (!username && !email) return user;

    try {
      user = await this.userRepository.findOne({
        withDeleted: deleted,
        relations: withRelations ? ['solitaireHistory', 'solitaireStats', 'savedGame'] : [],
        where: {
          ...(username && { username }), 
          ...(email && { email })
        },
      });
    } catch(error) {
      console.error(error.message);
      throw new Error('Error finding one user! | user.service.ts');
    }

    if (plainPassword) {
      const validPassword = await this.hashService.verifyPassword(plainPassword, user.passwordHash);
      if (!validPassword) return null;
    }

    return user;
  }

  async update(username:string, updateUserDto: UpdateUserDto): Promise<boolean> {
    try {
      const result = await this.userRepository.update(username, updateUserDto);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error(error.message);
      throw new Error('Failed to update user! | user.service.ts');
    }
  }

  async remove(username: string, email: string, plainPassword: string): Promise<boolean> {
    const user = await this.findUser(username, email, plainPassword, false, true);
    if (!user) return false;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.softRemove(user);
      await queryRunner.manager.softRemove(user.savedGame);
      await queryRunner.manager.softRemove(user.solitaireStats);
      for (let i in user.solitaireHistory) {
        await queryRunner.manager.softRemove(user.solitaireHistory[i]);
      }

      await queryRunner.commitTransaction();
      return true;
    } catch(error) {
      await queryRunner.rollbackTransaction();
      console.error(error.message);
      throw new Error('Error trying to soft remove user! | user.service.ts');
    } finally {
      await queryRunner.release();
    }
  }

  async restore(username: string, email: string, plainPassword: string): Promise<boolean> {
    const user = await this.findUser(username, email, plainPassword, true, true);
    if (!user) return false;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      await queryRunner.manager.restore(User, user.id);
      await queryRunner.manager.restore(SolitaireStats, user.solitaireStats.id);
      await queryRunner.manager.restore(SavedGame, user.savedGame.id);
      for (let i in user.solitaireHistory) {
        await queryRunner.manager.restore(SolitaireHistory, user.solitaireHistory[i].id);
      }

      await queryRunner.commitTransaction();
      return true;
    } catch(error) {
      await queryRunner.rollbackTransaction();
      console.error(error.message);
      throw new Error('Error trying to restore user and related entities! | user.service.ts');
    } finally {
      await queryRunner.release();
    }
  }
  
  async permanentlyRemoveOldUsers(): Promise<number> {
    try {
      const usersToRemove = await this.findUsersForPermanentRemoval();
      if (usersToRemove.length > 0) {
        await this.userRepository.remove(usersToRemove);
      }
      return usersToRemove.length;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error during old user cleanup! | user.service.ts');
    }
  }

  private async findUsersForPermanentRemoval(): Promise<User[]> {
    let usersToRemove: User[] = [];
    const ThirtyDaysAgo = new Date();
    ThirtyDaysAgo.setDate(ThirtyDaysAgo.getDate() - 30);

    try {
      usersToRemove = await this.userRepository.find({
        withDeleted: true,
        where: { deletedAt: LessThan(ThirtyDaysAgo)}
      });
    } catch(error) {
      usersToRemove = [];
      console.error(error.message);
      throw new Error('Error finding soft deleted user accounts! | user.service.ts');
    } finally {
      return usersToRemove;
    }
  }
}