import { Controller, Get, Post, Body, Patch, Delete, HttpStatus, Query } from '@nestjs/common';
import { SavedGameService } from './saved-game.service';
import { CreateSavedGameDto } from './dto/create-saved-game.dto';
import { UpdateSavedGameDto } from './dto/update-saved-game.dto';
import { FindGameHistoryDto } from '../game-history/dto/find-game-history.dto';
import { RemoveSavedGameDto } from './dto/remove-saved-game.dto';

@Controller(['saved-game', 'saved_game', 'savegame', 'saved'])
export class SavedGameController {
  constructor(private readonly savedGameService: SavedGameService) {}

  @Post('create')
  async create(@Body() createDto: CreateSavedGameDto) {
    return await this.savedGameService.create(createDto);
  }

  @Get('find-all')
  @Get('find_all')
  async findAll() {
    return await this.savedGameService.findAll();
  }

  @Get('find-one')
  @Get('find_one')
  @Get('find')
  @Get('load')
  async findOne(@Query() findDto: FindGameHistoryDto) {
    return await this.savedGameService.findOne(findDto);
  }

  @Patch('upsert')
  @Patch('save')
  async upsert(@Body() updateDto: UpdateSavedGameDto) {
    return await this.savedGameService.upsert(updateDto);
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateSavedGameDto) {
    return await this.savedGameService.update(updateDto);
  }

  @Delete('remove')
  @Delete('delete')
  async remove(@Query() removeDto: RemoveSavedGameDto) {
    return await this.savedGameService.remove(removeDto);
  }
  
  @Patch('restore')
  async restore(@Body() restoreDto: RemoveSavedGameDto) {
    return await this.savedGameService.restore(restoreDto);
  }
}
