import { Controller, Get, Post, Body, Patch, Delete, Query, Param } from '@nestjs/common';

import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history.dto';
import { UpdateGameHistoryDto } from './dto/update-game-history.dto';
import { FindGameHistoryDto } from './dto/find-game-history.dto';
import { RemoveGameHistoryDto } from './dto/remove-game-history.dto';

@Controller(['game-history', 'game_history', 'history'])
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Post(['start-game', 'start_game'])
  async startGame(@Body() startDto: CreateGameHistoryDto) {
    await this.gameHistoryService.create(startDto);
  }

  @Patch(['end-game', 'end_game'])
  async endGame(@Body() updateDto: UpdateGameHistoryDto) {
    await this.gameHistoryService.endGame(updateDto);
  }

  @Get(['get-all-games-user/:username', 'get_all_games_user:/username'])
  async getAllGames(@Param('username') username: string) {
    return await this.gameHistoryService.findAllForUser(username);
  }

  @Post('create')
  async create(@Body() createDto: CreateGameHistoryDto) {
    await this.gameHistoryService.create(createDto);
  }

  @Get(['find-all', 'find_all'])
  async findAll() {
    return await this.gameHistoryService.findAll();
  }

  @Get(['find-one', 'find_one'])
  async findOne(@Query() findDto: FindGameHistoryDto) {
    // passes the whole query obj into the service!
    return await this.gameHistoryService.findOne(findDto);
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateGameHistoryDto) {
    return await this.gameHistoryService.update(updateDto);
  }

  @Delete('remove')
  async remove(@Body() removeDto: RemoveGameHistoryDto) {
    return await this.gameHistoryService.remove(removeDto);
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveGameHistoryDto) {
    return await this.gameHistoryService.restore(restoreDto);
  }
}
