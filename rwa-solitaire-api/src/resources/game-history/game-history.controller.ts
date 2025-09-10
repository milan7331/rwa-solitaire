import { Controller, Get, Post, Body, Patch, Delete, Query, Param, NotFoundException } from '@nestjs/common';

import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history.dto';
import { UpdateGameHistoryDto } from './dto/update-game-history.dto';
import { FindGameHistoryDto } from './dto/find-game-history.dto';
import { RemoveGameHistoryDto } from './dto/remove-game-history.dto';
import { EndGameHistoryDto } from './dto/end-game-history.dto';
import { GameHistoryResponseDto } from './dto/game-history-response.dto';
import { GameHistory } from './entities/game-history.entity';

@Controller(['game-history', 'game_history', 'history'])
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Post(['create', 'start-game', 'start_game'])
  async create(@Body() createDto: CreateGameHistoryDto): Promise<void> {
    await this.gameHistoryService.create(createDto);
  }

  @Get(['get-all-games-user/:username', 'get_all_games_user:/username'])
  async getAllGames(@Param('username') username: string): Promise<GameHistoryResponseDto[]> {
    const games = await this.gameHistoryService.findAllForUser(username);
    return games.map(game => this.gameHistoryService.cleanUpGameHistoryResponse(game));
  }

  @Get(['find-all', 'find_all'])
  async findAll(): Promise<GameHistory[]> {
    return await this.gameHistoryService.findAll();
  }

  @Get(['find-one', 'find_one'])
  async findOne(@Query() findDto: FindGameHistoryDto): Promise<GameHistory> {
    // passes the whole query obj into the service!
    const game = await this.gameHistoryService.findOne(findDto);
    if (game === null) throw new NotFoundException('Game not found!');
    return game;
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateGameHistoryDto): Promise<void> {
    return await this.gameHistoryService.update(updateDto);
  }

  @Patch(['end-game', 'end_game'])
  async endGame(@Body() endDto: EndGameHistoryDto): Promise<void> {
    await this.gameHistoryService.endGame(endDto);
  }

  @Delete('remove')
  async remove(@Body() removeDto: RemoveGameHistoryDto): Promise<void> {
    return await this.gameHistoryService.remove(removeDto);
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveGameHistoryDto): Promise<void> {
    return await this.gameHistoryService.restore(restoreDto);
  }
}
