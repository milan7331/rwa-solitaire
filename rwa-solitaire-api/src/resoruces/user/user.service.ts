import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

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
    const result = await this.userRepository.update(id, updateUserDto);
    if (result.affected > 0) return true;
    return false;
  }



  async remove(id: number): Promise<void> {
    await this.userRepository.softRemove();
  }
}
