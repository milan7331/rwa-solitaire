import { Controller, Get, Post, Body, Patch, Delete, Put, Query } from '@nestjs/common';

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
  async leaderboardRefresh(type: LeaderboardType) {
    return await this.leaderboardService.leaderboardRefresh(type);
  }

  @Get('load-weekly')
  @Get('load_weekly')
  async loadWeeklyLeaderboards(@Query() getDto: GetLeaderboardDto) {
    getDto.leaderboardType = LeaderboardType.WEEKLY;
    return await this.leaderboardService.loadLeaderboards(getDto);
  }

  @Get('load-monthly')
  @Get('load_monthly')
  async loadMonthlyLeaderboards(@Query() getDto: GetLeaderboardDto) {
    getDto.leaderboardType = LeaderboardType.MONTHLY;
    return await this.leaderboardService.loadLeaderboards(getDto);
  }

  @Get('load-yearly')
  @Get('load_yearly')
  async loadYearlyLeaderboards(@Query() getDto: GetLeaderboardDto) {
    getDto.leaderboardType = LeaderboardType.YEARLY;
    return await this.leaderboardService.loadLeaderboards(getDto);
  }

  @Post('create')
  async create(@Body() createDto: CreateLeaderboardDto) {
    return await this.leaderboardService.create(createDto);
  }

  @Get('find-all')
  @Get('find_all')
  async findAll(@Query() type: LeaderboardType) {
    return await this.leaderboardService.findAll(type, false);
  }

  @Get('find-one')
  @Get('find_one')
  @Get('find')
  async findOne(@Query() findDto: FindLeaderboardDto) {
    return await this.leaderboardService.findOne(findDto);
  }

  @Put('upsert')
  async upsert(@Body() upsertDto: UpdateLeaderboardDto) {
    return await this.leaderboardService.upsert(upsertDto);
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateLeaderboardDto) {
    return await this.leaderboardService.update(updateDto);
  }

  @Delete('remove')
  @Delete('delete')
  async remove(@Query() removeDto: RemoveLeaderboardDto) {
    return await this.leaderboardService.remove(removeDto);
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveLeaderboardDto) {
    return await this.leaderboardService.restore(restoreDto);
  }
}
