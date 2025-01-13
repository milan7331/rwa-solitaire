import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Put } from '@nestjs/common';

import { LeaderboardService } from './leaderboard.service';
import { CreateLeaderboardDto } from './dto/create-leaderboard.dto';
import { UpdateLeaderboardDto } from './dto/update-leaderboard.dto';
import { WeeklyLeaderboard } from './entities/leaderboard-weekly.entity';
import { MonthlyLeaderboard } from './entities/leaderboard-monthly.entity';
import { YearlyLeaderboard } from './entities/leaderboard-yearly.entity';
import { FindLeaderboardDto } from './dto/find-leaderboard.dto';
import { RemoveLeaderboardDto } from './dto/remove-leaderboard.dto';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) { }

  @Post('refresh')
  @Post('refresh-leaderboard')
  @Post('refresh_leaderboard')
  async leaderboardRefresh(type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard) {
    const result = await this.leaderboardService.leaderboardRefresh(type);
    
    if (result) return {
      statusCode: HttpStatus.OK,
      message: type + ' refreshed!'
    }

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'No leaderboards were refreshed'
    }
  }
  
  @Post('create')
  async create(@Body() createLeaderboardDto: CreateLeaderboardDto) {
    await this.leaderboardService.create(createLeaderboardDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Leaderboard created!'
    }
  }

  @Get('find-all')
  @Get('find_all')
  async findAll(@Body() type: typeof WeeklyLeaderboard | typeof MonthlyLeaderboard | typeof YearlyLeaderboard) {
    const result = await this.leaderboardService.findAll(type, false);

    if (result.length > 0) return {
      statusCode: HttpStatus.OK,
      message: 'All leaderboards found',
      data: result
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No leaderboards found!'
    }
  }

  @Get('find-one')
  @Get('find_one')
  @Get('find')
  async findOne(@Body() findDto: FindLeaderboardDto) {
    const result = await this.leaderboardService.findOne(findDto);

    if (result !== null) return {
      statusCode: HttpStatus.OK,
      message: 'Leaderboard found!',
      data: result
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Leaderboard not found!'
    }
  }

  @Put('upsert')
  async upsert(@Body() updateDto: UpdateLeaderboardDto) {
    await this.leaderboardService.upsert(updateDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Leaderboard upsert successful!'
    }
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateLeaderboardDto) {
    const result = await this.leaderboardService.update(updateDto);

    if (result) return {
      statusCode: HttpStatus.OK,
      message: 'Leaderboard updated!'
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error updating leaderboard!'
    }
  }

  @Delete('remove')
  @Delete('delete')
  async remove(@Body() removeDto: RemoveLeaderboardDto) {
    await this.leaderboardService.remove(removeDto);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Leaderboard deleted!'
    }
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveLeaderboardDto) {
    const result = await this.leaderboardService.restore(restoreDto);

    if (result) return {
      statusCode: HttpStatus.OK,
      message: 'Leaderboard restored!'
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error restoring leaderboard!'
    }
  }
}
