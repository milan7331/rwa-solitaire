import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SolitaireStatsService } from './solitaire-stats.service';
import { CreateSolitaireStatDto } from './dto/create-solitaire-stats.dto';
import { UpdateSolitaireStatDto } from './dto/update-solitaire-stats.dto';

@Controller('solitaire-stats')
export class SolitaireStatsController {
  constructor(private readonly solitaireStatsService: SolitaireStatsService) {}

  @Post()
  create(@Body() createSolitaireStatDto: CreateSolitaireStatDto) {
    return this.solitaireStatsService.create(createSolitaireStatDto);
  }

  @Get()
  findAll() {
    return this.solitaireStatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solitaireStatsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSolitaireStatDto: UpdateSolitaireStatDto) {
    return this.solitaireStatsService.update(+id, updateSolitaireStatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solitaireStatsService.remove(+id);
  }
}
