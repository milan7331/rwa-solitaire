import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { Public } from 'src/auth/auth.decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { FindUserDto } from './dto/find-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('is-username-available')
  @Get('is_username_available')
  @Public()
  async checkUsername(@Query() username: string) {
    return await this.userService.isUsernameAvailable(username);
  }

  @Get('is-email-available')
  @Get('is_email_available')
  @Public()
  async checkEmail(@Query() email: string) {
    return await this.userService.isEmailAvailable(email);
  }

  @Post('register')
  @Post('create')
  @Public()
  async create(@Body() createDto: CreateUserDto) {
    return await this.userService.create(createDto);
  }

  @Get('find-one')
  @Get('find_one')
  @Get('find')
  async findOne(@Query() findDto: FindUserDto) {
    const result = await this.userService.findOne(findDto);
    if (result) result.passwordHash = '';
    return result;
  } 

  @Patch('update')
  async update(@Body() updateDto: UpdateUserDto) {
    return await this.userService.update(updateDto);
  }

  @Delete('remove')
  @Delete('delete')
  async remove(@Query() removeDto: RemoveUserDto) {
    return await this.userService.remove(removeDto);
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveUserDto) {
    return await this.userService.restore(restoreDto);
  }

  @Patch('remove-old-users')
  @Patch('remove_old_users')
  async removeOldUsers() {
    return await this.userService.permanentlyRemoveOldUsers();
  }
}
