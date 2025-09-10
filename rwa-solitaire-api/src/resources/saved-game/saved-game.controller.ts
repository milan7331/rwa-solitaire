import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { SavedGameService } from './saved-game.service';
import { CreateSavedGameDto } from './dto/create-saved-game.dto';
import { UpdateSavedGameDto } from './dto/update-saved-game.dto';
import { RemoveSavedGameDto } from './dto/remove-saved-game.dto';
import { FindSavedGameDto } from './dto/find-saved-game.dto';
import { SavedGameResponseDto } from './dto/saved-game-response.dto';

@Controller(['saved-game', 'saved_game', 'savegame', 'saved'])
export class SavedGameController {
  constructor(private readonly savedGameService: SavedGameService) {}

  @Post('create')
  async create(@Body() createDto: CreateSavedGameDto): Promise<void> {
    return await this.savedGameService.create(createDto);
  }

  @Get(['find-all', 'find_all'])
  async findAll(): Promise<SavedGameResponseDto[]> {
    const games = await this.savedGameService.findAll();
    return games.map(game => this.savedGameService.cleanupSavedGameResponse(game));
  }

  @Get(['find-one', 'find_one', 'load'])
  async findOne(@Query() findDto: FindSavedGameDto): Promise<SavedGameResponseDto | null> {
    const game = await this.savedGameService.findOne(findDto);
    if (game) return this.savedGameService.cleanupSavedGameResponse(game);
    return null;
  }

  @Patch('update')
  async update(@Body() updateDto: UpdateSavedGameDto): Promise<void> {
    return await this.savedGameService.update(updateDto);
  }

  @Delete('remove')
  async remove(@Body() removeDto: RemoveSavedGameDto): Promise<void> {
    return await this.savedGameService.remove(removeDto);
  }

  @Patch('restore')
  async restore(@Body() restoreDto: RemoveSavedGameDto): Promise<void> {
    return await this.savedGameService.restore(restoreDto);
  }
}
