import { Injectable } from '@nestjs/common';
import { CreateSolitaireStatDto } from './dto/create-solitaire-stats.dto';
import { UpdateSolitaireStatDto } from './dto/update-solitaire-stats.dto';

@Injectable()
export class SolitaireStatsService {
  create(createSolitaireStatDto: CreateSolitaireStatDto) {
    return 'This action adds a new solitaireStat';
  }

  findAll() {
    return `This action returns all solitaireStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solitaireStat`;
  }

  update(id: number, updateSolitaireStatDto: UpdateSolitaireStatDto) {
    return `This action updates a #${id} solitaireStat`;
  }

  remove(id: number) {
    return `This action removes a #${id} solitaireStat`;
  }
}
