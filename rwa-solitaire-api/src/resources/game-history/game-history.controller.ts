import { Controller, Get, Post, Body, Patch, Delete, HttpStatus, Query, Res } from '@nestjs/common';

import { User } from '../user/entities/user.entity';
import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history.dto';
import { UpdateGameHistoryDto } from './dto/update-game-history.dto';
import { FindGameHistoryDto } from './dto/find-game-history.dto';
import { RemoveGameHistoryDto } from './dto/remove-game-history.dto';

@Controller(['game-history', 'game_history', 'history'])
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Post('start-game')
  @Post('start_game')
  @Post('start')
  async startGame(@Body() startDto: CreateGameHistoryDto) {
    await this.gameHistoryService.create(startDto);
  }

  @Patch('end-game')
  @Patch('end_game')
  @Patch('end')
  async endGame(@Body() updateDto: UpdateGameHistoryDto) {
    await this.gameHistoryService.endGame(updateDto);
  }

  @Get('get-all-games-user')
  @Get('get_all_games_user')
  async getAllGames(@Query() username: string) {
    return await this.gameHistoryService.findAllForUser(username);
  }

  @Post('create')
  async create(@Body() createDto: CreateGameHistoryDto) {
    await this.gameHistoryService.create(createDto);
  }

  @Get('find-all')
  @Get('find_all')
  async findAll() {
    return await this.gameHistoryService.findAll();
  }

  @Get('find-one')
  @Get('find_one')
  @Get('find')
  async findOne(@Query() findDto: FindGameHistoryDto) {
    return await this.gameHistoryService.findOne(findDto);
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateGameHistoryDto) {
    return await this.gameHistoryService.update(updateDto);
  }

  @Delete('remove')
  @Delete('delete')
  async remove(@Query() removeDto: RemoveGameHistoryDto) {
    return await this.gameHistoryService.remove(removeDto);
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveGameHistoryDto) {
    return await this.gameHistoryService.restore(restoreDto);
  }
}
