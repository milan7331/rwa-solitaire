import { Controller, Get, Post, Patch, Delete, HttpStatus } from '@nestjs/common';
import { UserStatsService } from './user-stats.service';
import { CreateUserStatsDto } from './dto/create-user-stats.dto';
import { UpdateUserStatsDto } from './dto/update-user-stats.dto';
import { FindUserStatsDto } from './dto/find-user-stats.dto';
import { RemoveUserStatsDto } from './dto/remove-user-stats.dto';

@Controller(['user-stats', 'user_stats', 'stats'])
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}

  @Post('create')
  async create(createDto: CreateUserStatsDto) {
    await this.userStatsService.create(createDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User stats created.'
    };
  }

  @Get('find-one')
  @Get('find_one')
  @Get('find')
  async findOne(findDto: FindUserStatsDto) {
    const result = await this.userStatsService.findOne(findDto);

    if (result !== null) return {
      statusCode: HttpStatus.OK,
      message: 'User stats found!',
      data: result
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'User stats not found!'
    }
  }

  @Patch('update')
  async update(updateDto: UpdateUserStatsDto) {
    const result = await this.userStatsService.update(updateDto);

    if (result) return {
      statusCode: HttpStatus.OK,
      message: 'User stats updated!'
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error updating user stats!'
    }
  }

  @Delete('remove')
  @Delete('delete')
  async remove(removeDto: RemoveUserStatsDto) {
    await this.userStatsService.remove(removeDto);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'User deleted!'
    }
  }

  @Patch('restore')
  async restore(restoreDto: RemoveUserStatsDto) {
    const result = await this.userStatsService.restore(restoreDto);

    if (result) return {
      statusCode: HttpStatus.OK,
      message: 'User stats restored!'
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error restoring user stats!'
    }
  }
}
