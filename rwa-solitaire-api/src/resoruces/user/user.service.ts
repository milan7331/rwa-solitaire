import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

// export interface User1 {
//   userId: number,
//   username: string,
//   password: string;
// }

@Injectable()
export class UserService {
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

  constructor(
    @InjectRepository(User)
    private usersRepository:Repository<User>,
    private dataSource: DataSource
  ) { }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
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
    return this.usersRepository.find();
  }
  
  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({username});
  }

  async findOneById(id: number): Promise<User | null> {
    // return this.users.find(user => user.username === username);
    return this.usersRepository.findOneBy({id});
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
