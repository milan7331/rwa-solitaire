import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { CreateGameHistoryDto } from './dto/create-game-history.dto';
import { UpdateGameHistoryDto } from './dto/update-game-history.dto';
import { User } from '../user/entities/user.entity';
import { SolitaireDifficulty } from './entities/game-history.entity';

@Controller('game-history')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Post('start-game')
  async startGame(
    @Body() user: User,
    @Body() startedTime: Date,
    @Body() gameDifficulty: SolitaireDifficulty
  ) {
    try {
      const result = await this.gameHistoryService.startGame(user, startedTime, gameDifficulty);

      if (result) return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Game started sucessfully!'
      };

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Game not started!'
      };
    } catch(error) {
      console.error('Error :' + error);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('end-game')
  async endGame(@Body() updateDto: UpdateGameHistoryDto) {
    try {
      const result = await this.gameHistoryService.endGame(updateDto);
      
      if (result) return {
        statusCode: HttpStatus.ACCEPTED,
        message: 'Game ended sucessfully'
      };

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Error ending game!'
      };
    } catch(error) {
      console.error('Error: ' + error);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('get-all-games-user')
  async getAllGames(@Body() user: User) {
    try {
      const result = await this.gameHistoryService.findAllForUser(user);
      
      if (result.length > 0) return {
        statusCode: HttpStatus.FOUND,
        message: 'Users games found.',
        data: result
      };

      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No games matching criteria found! {user}'
      };
    } catch(error) {
      console.error('Error: ' + error);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('create')
  async create(@Body() createGameHistoryDto: CreateGameHistoryDto) {
    try {
      const result = await this.gameHistoryService.create(createGameHistoryDto);
      
      if (result) return {
        statusCode: HttpStatus.CREATED,
        message: 'Game created.'
      };

      return {
        statusCode: HttpStatus.
      }
    } catch(error) {
      console.error('Error: ' + error);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('find-all')
  async findAll() {
    try {
      const result = await this.gameHistoryService.findAll();

      if (result.length > 0) return {
        statusCode: HttpStatus.FOUND,
        message: 'All games found',
        data: result
      }

      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'No games found!'
      }

    } catch(error) {
      console.error('Error: ' + error);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('find-one')
  async findOne(
    @Body('id') id: number | null = null,
    @Body('user') user: User | null = null,
    @Body('startedTime') startedTime: Date | null = null,
  ) {
    try {
      const result = await this.gameHistoryService.findOne(id, user, startedTime, false);
      if (!result) return {
        statusCode: HttpStatus.FOUND,
        message: 'Game found!',
        data: result
      }

      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Game not found!'
      }

    } catch(error) {
      console.error('Error: ' + error);
      throw new HttpException('Something went wrong!', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGameHistoryDto: UpdateGameHistoryDto) {
    return await this.gameHistoryService.update(+id, updateGameHistoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.gameHistoryService.remove(+id);
  }
}
