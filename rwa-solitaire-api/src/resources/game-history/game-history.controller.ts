import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';

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
    const result = await this.gameHistoryService.startGame(startDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Game started sucessfully!'
    };
  }

  @Patch('end-game')
  @Patch('end_game')
  @Patch('end')
  async endGame(@Body() updateDto: UpdateGameHistoryDto) {
    const result = await this.gameHistoryService.endGame(updateDto);
    
    return {
      statusCode: HttpStatus.OK,
      message: 'Game ended sucessfully'
    };
  }

  @Get('get-all-games-user')
  @Get('get_all_games_user')
  async getAllGames(@Body() user: User) {
    const result = await this.gameHistoryService.findAllForUser(user);
    
    if (result.length > 0) return {
      statusCode: HttpStatus.OK,
      message: 'Users games found.',
      data: result
    };

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No games matching criteria found!'
    };
  }

  @Post('create')
  async create(@Body() createDto: CreateGameHistoryDto) {
    await this.gameHistoryService.create(createDto);
    
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Game created.'
    };
  }

  @Get('find-all')
  @Get('find_all')
  async findAll() {
    const result = await this.gameHistoryService.findAll();

    if (result.length > 0) return {
      statusCode: HttpStatus.OK,
      message: 'All games found',
      data: result
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No games found!'
    }
  }

  @Get('find-one')
  @Get('find_one')
  @Get('find')
  async findOne(@Body() findDto: FindGameHistoryDto) {
    const result = await this.gameHistoryService.findOne(findDto);

    if (result !== null) return {
      statusCode: HttpStatus.OK,
      message: 'Game found!',
      data: result
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Game not found!'
    }
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateGameHistoryDto) {
    const result = await this.gameHistoryService.update(updateDto);

    if (result) return {
      statusCode: HttpStatus.OK,
      message: 'Game updated!'
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error updating game!'
    }
  }

  @Delete('remove')
  @Delete('delete')
  async remove(@Body() removeDto: RemoveGameHistoryDto) {
    await this.gameHistoryService.remove(removeDto);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Game deleted!'
    }
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveGameHistoryDto) {
    const result = await this.gameHistoryService.restore(restoreDto);

    if (result) return {
      statusCode: HttpStatus.OK,
      message: 'Game restored!'
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error restoring deleted game!'
    }
  }
}
