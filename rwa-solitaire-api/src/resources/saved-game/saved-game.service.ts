import { Injectable } from '@nestjs/common';
import { CreateSavedGameDto } from './dto/create-saved-game.dto';
import { UpdateSavedGameDto } from './dto/update-saved-game.dto';
import { SavedGame } from './entities/saved-game.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Injectable()
export class SavedGameService {
  constructor(
    @InjectRepository(SavedGame)
    private readonly savedGameRepository: Repository<SavedGame>,
  ) { }

  async saveGame(saveDto: UpdateSavedGameDto): Promise<boolean> {
    if (!saveDto.gameState || !saveDto.user) throw new Error('Error saving game! | saved-game.service.ts');
  
    return this.update(saveDto, null, saveDto.user);
  }

  async loadGame(id?: number, user?: User): Promise<SavedGame | null> {
    if (!id && !user) throw new Error('Error loading game! | saved-game.service.ts');
    
    return this.findOne(id, user, false);
  }

  async deleteSavedGame(id?: number, user?: User): Promise<boolean> {
    if (!id && !user) throw new Error('Error deleting users saved game! | saved-game.service.ts');

    return this.remove(id, user);    
  }

  async create(createSavedGameDto: CreateSavedGameDto): Promise<boolean> {
    let newSave = new SavedGame();
    newSave.gameState = createSavedGameDto.gameState;
    newSave.user = createSavedGameDto.user;

    try {
      const existingSave = await this.findOne(null, newSave.user, false);
      if (existingSave) throw new Error('Error creating game save, user already has a saved game! | saved-game.service.ts');

      await this.savedGameRepository.save(newSave);
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error creating game save! | saved-game.service.ts');
    }
  }

  async findOne(id?: number, user?: User, withDeleted?: boolean): Promise<SavedGame | null> {
    if (!id && !user) throw new Error('Error finding saved game! | saved-game.service.ts');

    try {
      let game = this.savedGameRepository.findOne({
        where: {
          ...(id && { id: id }),
          ...(user && { user: user })
        },
        withDeleted: withDeleted ?? false
      });
  
      return game;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error finding saved game! | saved-game.service.ts');
    }
  }

  async update(updateSavedGameDto: UpdateSavedGameDto, id?: number, user?: User): Promise<boolean> {
    if (!id && !user) throw new Error('Error finding saved game to update! | saved-game.service.ts');
    
    const game = await this.findOne(id, user, false);
    if (!game) throw new Error('No game to update found! | saved-game.service.ts');

    try {
      const result = await this.savedGameRepository.update(id, updateSavedGameDto);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error updating saved game! | saved-game.service.ts');
    }
  }

  async remove(id?: number, user?: User): Promise<boolean> {
    if (!id && !user) throw new Error('Error finding saved game to delete! | saved-game.service.ts');

    const game = await this.findOne(id, user, false);
    if (!game) throw new Error('No saved game to remove found! | saved-game.service.ts');

    try {
      await this.savedGameRepository.softRemove(game);
      return true;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error removing saved game! | saved-game.service.ts');
    }
  }

  async restore(id?: number, user?: User): Promise<boolean> {
    if (!id && !user) throw new Error('Error finding saved game to restore! | saved-game.service.ts');

    const game = await this.findOne(id, user, true);
    if (!game) throw new Error('No saved game to restore found! | saved-game.service.ts');

    try {
      const result = await this.savedGameRepository.restore(id);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error(error.message);
      throw new Error('Error restoring saved game! | saved-game.service.ts');
    }
  }
}
