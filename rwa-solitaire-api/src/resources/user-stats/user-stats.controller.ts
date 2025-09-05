import { Controller, Get, Post, Patch, Delete, Body, Query } from '@nestjs/common';
import { UserStatsService } from './user-stats.service';
import { CreateUserStatsDto } from './dto/create-user-stats.dto';
import { UpdateUserStatsDto } from './dto/update-user-stats.dto';
import { FindUserStatsDto } from './dto/find-user-stats.dto';
import { RemoveUserStatsDto } from './dto/remove-user-stats.dto';
import { UserStatsReponseDto } from './dto/user-stats-response.dto';

@Controller(['user-stats', 'user_stats', 'stats'])
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}

  @Post('create')
  async create(@Body() createDto: CreateUserStatsDto): Promise<void> {
    return await this.userStatsService.create(createDto);
  }

  @Get(['find-one', 'find_one'])
  async findOne(@Query() findDto: FindUserStatsDto): Promise<UserStatsReponseDto | null> {
    const stats = await this.userStatsService.findOne(findDto);
    if (stats) return this.userStatsService.cleanUpUserStatsResponse(stats);
    return;
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateUserStatsDto) {
    return await this.userStatsService.update(updateDto);
  }

  @Delete('remove')
  async remove(@Body() removeDto: RemoveUserStatsDto) {
    return await this.userStatsService.remove(removeDto);
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveUserStatsDto) {
    return await this.userStatsService.restore(restoreDto);
  }
}
