import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavedGameDto } from './dto/create-saved-game.dto';
import { UpdateSavedGameDto } from './dto/update-saved-game.dto';
import { SavedGame } from './entities/saved-game.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { handlePostgresError } from 'src/util/postgres-error-handler';
import { FindSavedGameDto } from './dto/find-saved-game.dto';
import { RemoveSavedGameDto } from './dto/remove-saved-game.dto';

@Injectable()
export class SavedGameService {
  constructor(
    @InjectRepository(SavedGame)
    private readonly savedGameRepository: Repository<SavedGame>,
  ) { }

  async saveGame(saveDto: UpdateSavedGameDto): Promise<boolean> {
    if (!saveDto.gameState || !saveDto.user) throw new BadRequestException('Invalid parameters!');
  
    return this.update(saveDto); 
  }

  async loadGame(findDto: FindSavedGameDto): Promise<SavedGame | null> {
    if (!findDto.id && !findDto.user) throw new BadRequestException('Invalid parameters!');
    
    return this.findOne(findDto);
  }

  async deleteSavedGame(removeDto: RemoveSavedGameDto): Promise<boolean> {
    if (!removeDto.id && !removeDto.user) throw new BadRequestException('Invalid parameters!');

    return this.remove(removeDto);    
  }

  async create(createDto: CreateSavedGameDto): Promise<boolean> {
    if (!createDto.gameState || !createDto.user) throw new BadRequestException('Invalid parameters!');

    const findDto: FindSavedGameDto = {
      user: createDto.user,
      withDeleted: false
    }

    try {
      const existingSave = await this.findOne(findDto);
      if (existingSave) throw new ConflictException('Error creating game save, user already has a saved game!');

      await this.savedGameRepository.save(createDto);
      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findAll(): Promise<SavedGame[]> {
    try {
      const games = this.savedGameRepository.find({ withDeleted: false });

      return games;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindSavedGameDto): Promise<SavedGame | null> {
    const { id, user, withDeleted } = findDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');
    
    const where: any = { }
    if (id) where.id = id;
    if (user) where.user = user;

    try {
      const game = this.savedGameRepository.findOne({
        where,
        withDeleted
      });
  
      return game;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async upsert(upsertDto: UpdateSavedGameDto): Promise<boolean> {
    const { id, user, gameState } = upsertDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

    try {
      await this.savedGameRepository.upsert(upsertDto, {
        conflictPaths: ['user'],
      });
      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async update(updateDto: UpdateSavedGameDto): Promise<boolean> {
    const { id, user, gameState } = updateDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');
    
    const findDto: FindSavedGameDto = {
      id,
      user,
      withDeleted: false
    }

    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No game to update found!');

    try {
      const result = await this.savedGameRepository.update(id, updateDto);
      if (result.affected > 0) return true;
      return false;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveSavedGameDto): Promise<boolean> {
    const { id, user } = removeDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

    const findDto: FindSavedGameDto = {
      id,
      user,
      withDeleted: false
    }

    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No saved game to remove found!');

    try {
      await this.savedGameRepository.softRemove(game);
      return true;
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async restore(restoreDto: RemoveSavedGameDto): Promise<boolean> {
    const { id, user } = restoreDto;
    if (!id && !user) throw new BadRequestException('Invalid parameters!');

    const findDto: FindSavedGameDto = {
      id,
      user,
      withDeleted: true
    }

    const game = await this.findOne(findDto);
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
