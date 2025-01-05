import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, HttpException, ValidationPipe } from '@nestjs/common';

import { UserService } from './user.service';
import { Public } from 'src/auth/auth.decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @HttpCode(201)
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const result = await this.userService.create(createUserDto);
      if (!result) throw new HttpException('User not created!', HttpStatus.INTERNAL_SERVER_ERROR);

      return {
        statusCode: HttpStatus.CREATED,
        message: 'User sucessfuly registered'
      };
    } catch(error) {
      console.error(error.message);
      if (error.code === '23505') {
        throw new HttpException('User already exists!', HttpStatus.CONFLICT);
      } else {
        throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    try {
      const user = await this.userService.findOne(username, null, null, false, false);
      if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

      user.passwordHash = '';
      return {
        HttpStatus: HttpStatus.OK,
        message: 'User found!',
        data: user
      };
    } catch(error) {
      console.error(error.message);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  } 

  @Patch('update')
  async update(@Body() username: string, @Body() plainPassword: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userService.update(username, plainPassword, updateUserDto);
      if (!result) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

      return {
        statusCode: HttpStatus.OK,
        message: 'User updated sucessfully'
      };
    } catch(error) {
      console.error(error.message);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('delete')
  async deleteAccount(@Body() deleteUser: DeleteUserDto) {
    try {
      const result = await this.userService.remove(deleteUser.username, deleteUser.email, deleteUser.password);
      if (!result) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted sucessfully'
      }
    } catch(error) {
      console.error(error.message);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('restore')
  async restoreAccount(@Body() restoreUser: DeleteUserDto) {
    try {
      const result = await this.userService.restore(restoreUser.username, restoreUser.email, restoreUser.password);
      if (!result) {
        throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'User restored sucessfully'
      }
    } catch(error) {
      console.error(error.message);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
