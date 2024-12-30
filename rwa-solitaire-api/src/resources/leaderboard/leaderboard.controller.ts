import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { LeaderboardWeeklyService } from './leaderboard.weekly.service';
import { LeaderboardMonthlyService } from './leaderboard.monthly.service';
import { LeaderboardYearlyService } from './leaderboard.yearly.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private readonly weeklyService: LeaderboardWeeklyService,
    private readonly monthlyService: LeaderboardMonthlyService,
    private readonly yearlyService: LeaderboardYearlyService
  ) {}

  @Post()
  create(@Body() createLeaderboardDto: CreateLeaderboardDto) {
    return this.weeklyService.create(createLeaderboardDto);
  }

  @Get()
  findAll() {
    return this.weeklyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weeklyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaderboardDto: UpdateLeaderboardDto) {
    return this.weeklyService.update(+id, updateLeaderboardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weeklyService.remove(+id);
  }
}
