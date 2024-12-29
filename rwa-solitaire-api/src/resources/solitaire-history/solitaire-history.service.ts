import { Injectable } from '@nestjs/common';
import { CreateSolitaireHistoryDto } from './dto/create-solitaire-history.dto';
import { UpdateSolitaireHistoryDto } from './dto/update-solitaire-history.dto';

@Injectable()
export class SolitaireHistoryService {
  create(createSolitaireHistoryDto: CreateSolitaireHistoryDto) {
    return 'This action adds a new solitaireHistory';
  }

  findAll() {
    return `This action returns all solitaireHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solitaireHistory`;
  }

  update(id: number, updateSolitaireHistoryDto: UpdateSolitaireHistoryDto) {
    return `This action updates a #${id} solitaireHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} solitaireHistory`;
  }
}
