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
  
    return this.update(null, saveDto.user, saveDto); 
  }

  async loadGame(
    id: number | null = null, 
    user: User | null = null
  ): Promise<SavedGame | null> {
    if (!id && !user) throw new Error('Error loading game! | saved-game.service.ts');
    
    return this.findOne(id, user, false);
  }

  async deleteSavedGame(
    id: number | null = null, 
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) throw new Error('Error deleting users saved game! | saved-game.service.ts');

    return this.remove(id, user);    
  }

  async create(createSavedGameDto: CreateSavedGameDto): Promise<boolean> {
    if (!createSavedGameDto.gameState || !createSavedGameDto.user) return false;

    try {
      const existingSave = await this.findOne(null, createSavedGameDto.user, false);
      if (existingSave) throw new Error('Error creating game save, user already has a saved game! | saved-game.service.ts');

      await this.savedGameRepository.save(createSavedGameDto);
      return true;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error creating game save! | saved-game.service.ts');
    }
  }

  async findOne(
    id: number | null = null, 
    user: User | null = null,
    withDeleted: boolean = false
  ): Promise<SavedGame | null> {
    if (!id && !user) throw new Error('Error finding saved game! | saved-game.service.ts');
    
    const where: any = { }
    if (id) where.id = id;
    if (user) where.user = user;

    try {
      let game = this.savedGameRepository.findOne({
        where,
        withDeleted
      });
  
      return game;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error finding saved game! | saved-game.service.ts');
    }
  }

  async upsert(
    id: number | null = null,
    updateDto: UpdateSavedGameDto
  ): Promise<boolean> {
    if (!id && !updateDto.user) throw new Error('Error preparing to upsert game save! | saved-game.service.ts');

    try {
      const result = await this.savedGameRepository.upsert(updateDto, {
        conflictPaths: ['user'],
      });
      return true;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error upserting game save! | saved-game.service.ts');
    }
  }

  async update(
    id: number | null = null,
    user: User | null = null,
    updateSavedGameDto: UpdateSavedGameDto
  ): Promise<boolean> {
    if (!id && !user) throw new Error('Error finding saved game to update! | saved-game.service.ts');
    
    const game = await this.findOne(id, user, false);
    if (!game) throw new Error('No game to update found! | saved-game.service.ts');

    try {
      const result = await this.savedGameRepository.update(id, updateSavedGameDto);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error updating saved game! | saved-game.service.ts');
    }
  }

  async remove(
    id: number | null = null, 
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) throw new Error('Error finding saved game to delete! | saved-game.service.ts');

    const game = await this.findOne(id, user, false);
    if (!game) throw new Error('No saved game to remove found! | saved-game.service.ts');

    try {
      await this.savedGameRepository.softRemove(game);
      return true;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error removing saved game! | saved-game.service.ts');
    }
  }

  async restore(
    id: number | null = null,
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) throw new Error('Error finding saved game to restore! | saved-game.service.ts');

    const game = await this.findOne(id, user, false);
    if (!game) throw new Error('No saved game to restore found! | saved-game.service.ts');

    try {
      const result = await this.savedGameRepository.restore(id);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      console.error('Error: ' + error);
      throw new Error('Error restoring saved game! | saved-game.service.ts');
    }
  }
}
