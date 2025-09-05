import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { Public } from 'src/auth/auth.decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(['check-username', 'check_username'])
  @Public()
  async checkUsername(@Query('username') username: string): Promise<void> {
    return await this.userService.isUsernameAvailable(username);
  }

  @Get(['check-email', 'check_email'])
  @Public()
  async checkEmail(@Query('email') email: string): Promise<void> {
    return await this.userService.isEmailAvailable(email);
  }

  @Post(['register', 'create'])
  @Public()
  async create(@Body() createDto: CreateUserDto): Promise<void> {
    return await this.userService.create(createDto);
  }


  @Get(['find-one', 'find_one'])
  async findOne(@Query() findDto: FindUserDto): Promise<UserResponseDto | null> {
    let user = await this.userService.findOne(findDto);
    if (user) return this.userService.cleanUpUserResponse(user);
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateUserDto): Promise<void> {
    return await this.userService.update(updateDto);
  }

  @Delete('remove')
  async remove(@Body() removeDto: RemoveUserDto): Promise<void> {
    return await this.userService.remove(removeDto);
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveUserDto): Promise<void> {
    return await this.userService.restore(restoreDto);
  }

  @Patch(['remove-old-users', 'remove_old_users'])
  async removeOldUsers() : Promise<void> {
    return await this.userService.permanentlyRemoveOldUsers();
  }
}
