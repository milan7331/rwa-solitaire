import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSavedGameDto } from './dto/create-saved-game.dto';
import { UpdateSavedGameDto } from './dto/update-saved-game.dto';
import { SavedGame } from './entities/saved-game.entity';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { handlePostgresError } from 'src/util/postgres-error-handler';
import { FindSavedGameDto } from './dto/find-saved-game.dto';
import { RemoveSavedGameDto } from './dto/remove-saved-game.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class SavedGameService {
  constructor(
    @InjectRepository(SavedGame)
    private readonly savedGameRepository: Repository<SavedGame>,

    private readonly userService: UserService,
  ) { }

  async create(createDto: CreateSavedGameDto): Promise<void> {
    const { gameState, userId } = createDto;
    if (!gameState || userId === undefined) throw new BadRequestException('Invalid parameters!');

    const findDto: FindSavedGameDto = {
      userId,
      withDeleted: false
    }

    const existingSave = await this.findOne(findDto);
    if (existingSave) throw new ConflictException('Error creating game save, user already has a saved game!');

    const user = this.userService.findOne({ id: userId, withDeleted: false, withRelations: false });
    if (!user) throw new NotFoundException('Error creating game save - cant find user account!');

    try {
      await this.savedGameRepository.save({ gameState, user } as DeepPartial<SavedGame>);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findAll(): Promise<SavedGame[]> {
    try {
      return this.savedGameRepository.find({ withDeleted: false });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async findOne(findDto: FindSavedGameDto): Promise<SavedGame> {
    const { id, userId, withDeleted } = findDto;
    if (id === undefined && userId === undefined) throw new BadRequestException('Invalid parameters!');
    let result: SavedGame | null;
    
    const where: any = { }
    if (id !== undefined) where.id = id;
    if (userId !== undefined) where.userId = userId;

    try {
      result = await this.savedGameRepository.findOne({
        where,
        withDeleted
      });
    } catch(error) {
      handlePostgresError(error);
    }

    if (!result) throw new NotFoundException('Saved game not found!');
    return result;
  }

  async upsert(upsertDto: UpdateSavedGameDto): Promise<void> {
    const { id, userId } = upsertDto;
    if (id === undefined && userId === undefined) throw new BadRequestException('Invalid parameters!');

    try {
      await this.savedGameRepository.upsert(upsertDto, {
        conflictPaths: ['user'],
      });
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async update(updateDto: UpdateSavedGameDto): Promise<void> {
    const { id, userId } = updateDto;
    if (id === undefined && userId === undefined) throw new BadRequestException('Invalid parameters!');
    
    const findDto: FindSavedGameDto = {
      id,
      userId,
      withDeleted: false
    }

    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No game to update found!');

    try {
      const result = await this.savedGameRepository.update(game.id, updateDto);
      if (result.affected <= 0) throw new BadRequestException('Error updating saved game!');
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async remove(removeDto: RemoveSavedGameDto): Promise<void> {
    const { id, userId } = removeDto;
    if (id === undefined && userId === undefined) throw new BadRequestException('Invalid parameters!');

    const findDto: FindSavedGameDto = {
      id,
      userId,
      withDeleted: false
    }

    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No saved game to remove found!');

    try {
      await this.savedGameRepository.softRemove(game);
    } catch(error) {
      handlePostgresError(error);
    }
  }

  async restore(restoreDto: RemoveSavedGameDto): Promise<void> {
    const { id, userId } = restoreDto;
    if (id === undefined && userId === undefined) throw new BadRequestException('Invalid parameters!');

    const findDto: FindSavedGameDto = {
      id,
      userId,
      withDeleted: true
    }

    const game = await this.findOne(findDto);
    if (!game) throw new NotFoundException('No saved game to restore found!');

    try {
      const result = await this.savedGameRepository.restore(game.id);
      if (result.affected <= 0) throw new BadRequestException('Error restoring saved game!');
    } catch(error) {
      handlePostgresError(error);
    }
  }
}
