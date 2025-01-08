import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserStatsService } from './user-stats.service';
import { CreateUserStatsDto } from './dto/create-user-stats.dto';
import { UpdateUserStatsDto } from './dto/update-user-stats.dto';

@Controller('user-stats')
export class UserStatsController {
  constructor(private readonly userStatsService: UserStatsService) {}


  // PREPRAVITI SVE DTO, koristese u servisu a nisu napisani!

  // @Post()
  // create(@Body() createUserStatsDto: CreateUserStatsDto) {
  //   return this.UserStatsService.create(createUserStatsDto);
  // }

  // @Get()
  // findAll() {
  //   return this.UserStatsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.UserStatsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserStatsDto: UpdateUserStatsDto) {
  //   return this.UserStatsService.update(+id, updateUserStatsDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.UserStatsService.remove(+id);
  // }
}
