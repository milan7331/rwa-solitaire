import { Injectable } from '@nestjs/common';
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
    const hashedPassword = this.hashService.hashPassword(createUserDto.password);
    const newDTO = {...createUserDto}


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

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
  
  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({username});
  }

  async findOneById(id: number): Promise<User | null> {
    // return this.users.find(user => user.username === username);
    return this.userRepository.findOneBy({id});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}

// export interface User1 {
//   userId: number,
//   username: string,
//   password: string;
// }

// private readonly users = [
//   {
//     userId: 1,
//     username: 'john',
//     password: 'changeme',
//   },
//   {
//     userId: 2,
//     username: 'maria',
//     password: 'guess',
//   },
// ];