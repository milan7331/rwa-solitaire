import { Controller, Get, Post, Body, Patch, Delete, HttpStatus } from '@nestjs/common';

import { UserService } from './user.service';
import { Public } from 'src/auth/auth.decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Post('create')
  @Public()
  async create(@Body() createDto: CreateUserDto) {
    await this.userService.create(createDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User account created.'
    };
  }

  @Get('find-one')
  @Get('find_one')
  @Get('find')
  async findOne(@Body() findDto: FindUserDto) {
    const result = await this.userService.findOne(findDto);
    if (result) result.passwordHash = '';

    if (result !== null) return {
      statusCode: HttpStatus.OK,
      message: 'User found!',
      data: result
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'User not found!'
    }
  } 

  @Patch('update')
  async update(@Body() updateDto: UpdateUserDto) {
    const result = await this.userService.update(updateDto);

    if (result) return {
      statusCode: HttpStatus.OK,
      message: 'User updated!'
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error updating user!'
    }
  }

  @Delete('remove')
  @Delete('delete')
  async remove(@Body() removeDto: RemoveUserDto) {
    await this.userService.remove(removeDto);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'User deleted!'
    }
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveUserDto) {
    await this.userService.restore(restoreDto);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'User restored!'
    }
  }

  @Patch('remove-old-users')
  @Patch('remove_old_users')
  async removeOldUsers() {
    const result = await this.userService.permanentlyRemoveOldUsers();

    return {
      statusCode: HttpStatus.OK,
      message: 'Number of old accounts permanently removed: ' + result
    }
  }
}
