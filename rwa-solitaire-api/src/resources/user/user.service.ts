import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, LessThan, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { HashService } from 'src/auth/hash.service';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepository:Repository<User>,
    private dataSource: DataSource,
    private hashService: HashService
  ) { }

  async create(createUserDto: CreateUserDto): Promise<boolean> {
    const { email, username, password } = createUserDto;
    const existingUser = await this.findOne(username, email);
    if (existingUser) throw new ConflictException('Username or email already exists!');
    
    const hashedPassword = await this.hashService.hashPassword(password);
    const newUser = this.userRepository.create({
      username,
      email,
      passwordHash: hashedPassword,
    })

    try {
      const result = await this.userRepository.save(newUser);
      return true;
    } catch(error) {
        console.error('Failed to save user:', error.message);
    }

    return false;
  }

  async createMany(users: User[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (let i in users) await queryRunner.manager.save(users[i]);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  
  async findOne(username?: string, email?: string): Promise<User | null> {
    if (!username && !email) return null;

    return this.userRepository.findOneBy({
      ...(username && { username }),
      ...(email && { email })
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    try {
      const result = await this.userRepository.update(id, updateUserDto);
      if (result.affected > 0) return true;
    } catch(error) {
      console.error('Failed to update user: ' + error.message);
    }
    return false;
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.userRepository.softRemove({id: id} as DeepPartial<User>);
      return true;
    } catch(error) {
      console.error('Failed to soft remove the user: ' + error.message);
    }
    return false;
  }

  private async findUsersForPermanentRemoval(): Promise<User[]> {
    const ThirtyDaysAgo = new Date();
    ThirtyDaysAgo.setDate(ThirtyDaysAgo.getDate() - 30);

    const usersToRemove = await this.userRepository.find({
      withDeleted: true,
      where: { deletedAt: LessThan(ThirtyDaysAgo)}
    });

    return usersToRemove;
  }

  async permanentlyRemoveOldUsers(): Promise<number> {
    try {
      const usersToRemove = await this.findUsersForPermanentRemoval();
      if (usersToRemove.length > 0) {
        await this.userRepository.remove(usersToRemove);
      }
      return usersToRemove.length;
    } catch(error) {
      throw new Error('Error during old user cleanup: ' + error.message);
    }
  }
}
