import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SavedGameService } from './saved-game.service';
import { CreateSavedGameDto } from './dto/create-saved-game.dto';
import { UpdateSavedGameDto } from './dto/update-saved-game.dto';

@Controller('saved-game')
export class SavedGameController {
  constructor(private readonly savedGameService: SavedGameService) {}

  @Post()
  create(@Body() createSavedGameDto: CreateSavedGameDto) {
    return this.savedGameService.create(createSavedGameDto);
  }

  @Get()
  findAll() {
    return this.savedGameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savedGameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSavedGameDto: UpdateSavedGameDto) {
    return this.savedGameService.update(+id, updateSavedGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savedGameService.remove(+id);
  }
}
