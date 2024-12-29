import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SolitaireHistoryService } from './solitaire-history.service';
import { CreateSolitaireHistoryDto } from './dto/create-solitaire-history.dto';
import { UpdateSolitaireHistoryDto } from './dto/update-solitaire-history.dto';

@Controller('solitaire-history')
export class SolitaireHistoryController {
  constructor(private readonly solitaireHistoryService: SolitaireHistoryService) {}

  @Post()
  create(@Body() createSolitaireHistoryDto: CreateSolitaireHistoryDto) {
    return this.solitaireHistoryService.create(createSolitaireHistoryDto);
  }

  @Get()
  findAll() {
    return this.solitaireHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solitaireHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSolitaireHistoryDto: UpdateSolitaireHistoryDto) {
    return this.solitaireHistoryService.update(+id, updateSolitaireHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solitaireHistoryService.remove(+id);
  }
}
