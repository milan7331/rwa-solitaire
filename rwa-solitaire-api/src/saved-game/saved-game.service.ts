import { Injectable } from '@nestjs/common';
import { CreateSavedGameDto } from './dto/create-saved-game.dto';
import { UpdateSavedGameDto } from './dto/update-saved-game.dto';

@Injectable()
export class SavedGameService {
  create(createSavedGameDto: CreateSavedGameDto) {
    return 'This action adds a new savedGame';
  }

  findAll() {
    return `This action returns all savedGame`;
  }

  findOne(id: number) {
    return `This action returns a #${id} savedGame`;
  }

  update(id: number, updateSavedGameDto: UpdateSavedGameDto) {
    return `This action updates a #${id} savedGame`;
  }

  remove(id: number) {
    return `This action removes a #${id} savedGame`;
  }
}
