import { Controller, Get, Post, Body, Patch, Delete, Put, Query, Param } from '@nestjs/common';

import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { FindLeaderboardDto } from './dto/find-leaderboard.dto';
import { RemoveLeaderboardDto } from './dto/remove-leaderboard.dto';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';
import { LeaderboardType } from './entities/leaderboard.enum';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) { }

  // manual leaderboard refresh
  @Get('refresh/:type')
  async leaderboardRefresh(@Param('type') type: LeaderboardType) {
    return await this.leaderboardService.leaderboardRefresh(type);
  }

  @Get(['load'])
  async loadLeaderboards(@Query() getDto: GetLeaderboardDto) {
    return await this.leaderboardService.loadLeaderboards(getDto);
  }

  @Post('create')
  async create(@Body() createDto: CreateLeaderboardDto) {
    return await this.leaderboardService.create(createDto);
  }

  @Get(['find-all/:type', 'find_all/:type'])
  async findAll(@Param('type') type: LeaderboardType) {
    return await this.leaderboardService.findAll(type, false);
  }

  @Get(['find-one', 'find_one'])
  async findOne(@Query() findDto: FindLeaderboardDto) {
    return await this.leaderboardService.findOne(findDto);
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateLeaderboardDto) {
    return await this.leaderboardService.update(updateDto);
  }

  @Delete('remove')
  async remove(@Body() removeDto: RemoveLeaderboardDto) {
    return await this.leaderboardService.remove(removeDto);
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveLeaderboardDto) {
    return await this.leaderboardService.restore(restoreDto);
  }
}
