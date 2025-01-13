import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { SavedGameService } from './saved-game.service';
import { CreateSavedGameDto } from './dto/create-saved-game.dto';
import { UpdateSavedGameDto } from './dto/update-saved-game.dto';
import { FindGameHistoryDto } from '../game-history/dto/find-game-history.dto';
import { RemoveSavedGameDto } from './dto/remove-saved-game.dto';
import { FindSavedGameDto } from './dto/find-saved-game.dto';

@Controller(['saved-game', 'saved_game', 'savegame', 'saved'])
export class SavedGameController {
  constructor(private readonly savedGameService: SavedGameService) {}

  @Post('create')
  async create(@Body() createSavedGameDto: CreateSavedGameDto) {
    await this.savedGameService.create(createSavedGameDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Game saved / created!'
    }
  }

  @Get('find-all')
  @Get('find_all')
  async findAll() {
    const result = await this.savedGameService.findAll();

    if (result.length > 0) return {
      statusCode: HttpStatus.OK,
      message: 'All saved games found',
      data: result
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'No saved games found!'
    }
  }

  @Get('find-one')
  @Get('find_one')
  @Get('find')
  @Get('load')
  async findOne(@Body() findDto: FindGameHistoryDto) {
    const result = await this.savedGameService.findOne(findDto);

    if (result !== null) return {
      statusCode: HttpStatus.OK,
      message: 'Saved game found!',
      data: result
    }

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Saved game not found!'
    }
  }

  @Patch('upsert')
  @Patch('save')
  async upsert(@Body() updateDto: UpdateSavedGameDto) {
    await this.savedGameService.update(updateDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'Saved game upsert successful!'
    }
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateSavedGameDto) {
    const result = await this.savedGameService.update(updateDto);

    if (result) return {
      statusCode: HttpStatus.OK,
      message: 'Saved game updated!'
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error updating saved game!'
    }
  }

  @Delete('remove')
  @Delete('delete')
  async remove(@Body() removeDto: RemoveSavedGameDto) {
    await this.savedGameService.remove(removeDto);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Saved game deleted!'
    }
  }
  
  @Patch('restore')
  async restore(@Body() restoreDto: RemoveSavedGameDto) {
    const result = await this.savedGameService.restore(restoreDto);

    if (result) return {
      statusCode: HttpStatus.OK,
      message: 'Saved game restored!'
    }

    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Error restoring saved game!'
    }
  }
}