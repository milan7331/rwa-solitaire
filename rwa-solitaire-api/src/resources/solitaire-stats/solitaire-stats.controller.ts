import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SolitaireStatsService } from './solitaire-stats.service';
import { CreateSolitaireStatsDto } from './dto/create-solitaire-stats.dto';
import { UpdateSolitaireStatsDto } from './dto/update-solitaire-stats.dto';

@Controller('solitaire-stats')
export class SolitaireStatsController {
  constructor(private readonly solitaireStatsService: SolitaireStatsService) {}


  // PREPRAVITI SVE DTO, koristese u servisu a nisu napisani!

  // @Post()
  // create(@Body() createSolitaireStatsDto: CreateSolitaireStatsDto) {
  //   return this.solitaireStatsService.create(createSolitaireStatsDto);
  // }

  // @Get()
  // findAll() {
  //   return this.solitaireStatsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.solitaireStatsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSolitaireStatsDto: UpdateSolitaireStatsDto) {
  //   return this.solitaireStatsService.update(+id, updateSolitaireStatsDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.solitaireStatsService.remove(+id);
  // }
}
