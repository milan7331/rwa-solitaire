import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavedGameDto } from './dto/create-saved-game.dto';
import { UpdateSavedGameDto } from './dto/update-saved-game.dto';
import { SavedGame } from './entities/saved-game.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { handlePostgresError } from 'src/database/postgres-error-handler';

@Injectable()
export class SavedGameService {
  constructor(
    @InjectRepository(SavedGame)
    private readonly savedGameRepository: Repository<SavedGame>,
  ) { }

  async saveGame(saveDto: UpdateSavedGameDto): Promise<boolean> {
    if (!saveDto.gameState || !saveDto.user) throw new BadRequestException('Invalid parameters!');
  
    return this.update(null, saveDto.user, saveDto); 
  }

  async loadGame(
    id: number | null = null, 
    user: User | null = null
  ): Promise<SavedGame | null> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');
    
    return this.findOne(id, user, false);
  }

  async deleteSavedGame(
    id: number | null = null, 
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

    return this.remove(id, user);    
  }

  async create(createSavedGameDto: CreateSavedGameDto): Promise<boolean> {
    if (!createSavedGameDto.gameState || !createSavedGameDto.user) return false;

    try {
      const existingSave = await this.findOne(null, createSavedGameDto.user, false);
      if (existingSave) throw new ConflictException('Error creating game save, user already has a saved game!');

      await this.savedGameRepository.save(createSavedGameDto);
      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findOne(
    id: number | null = null, 
    user: User | null = null,
    withDeleted: boolean = false
  ): Promise<SavedGame | null> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');
    
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
      handlePostgresError(error);
    }
  }

  async upsert(
    id: number | null = null,
    updateDto: UpdateSavedGameDto
  ): Promise<boolean> {
    if (!id && !updateDto.user) throw new BadRequestException('Invalid parameters!');

    try {
      await this.savedGameRepository.upsert(updateDto, {
        conflictPaths: ['user'],
      });
      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async update(
    id: number | null = null,
    user: User | null = null,
    updateSavedGameDto: UpdateSavedGameDto
  ): Promise<boolean> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');
    
    const game = await this.findOne(id, user, false);
    if (!game) throw new NotFoundException('No game to update found!');

    try {
      const result = await this.savedGameRepository.update(id, updateSavedGameDto);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async remove(
    id: number | null = null, 
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

    const game = await this.findOne(id, user, false);
    if (!game) throw new NotFoundException('No saved game to remove found!');

    try {
      await this.savedGameRepository.softRemove(game);
      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async restore(
    id: number | null = null,
    user: User | null = null
  ): Promise<boolean> {
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

    const game = await this.findOne(id, user, false);
    if (!game) throw new NotFoundException('No saved game to restore found!');

    try {
      const result = await this.savedGameRepository.restore(id);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      handlePostgresError(error);
    }
  }
}
