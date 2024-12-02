import { Injectable } from '@nestjs/common';
import { CreateSolitaireStatsDto } from './dto/create-solitaire-stats.dto';
import { UpdateSolitaireStatsDto } from './dto/update-solitaire-stats.dto';

@Injectable()
export class SolitaireStatsService {
  create(createSolitaireStatsDto: CreateSolitaireStatsDto) {
    return 'This action adds a new solitaireStats';
  }

  findAll() {
    return `This action returns all solitaireStats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solitaireStats`;
  }

  update(id: number, updateSolitaireStatsDto: UpdateSolitaireStatsDto) {
    return `This action updates a #${id} solitaireStats`;
  }

  remove(id: number) {
    return `This action removes a #${id} solitaireStats`;
  }
}
