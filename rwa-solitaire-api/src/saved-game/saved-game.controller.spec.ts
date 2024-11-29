import { Test, TestingModule } from '@nestjs/testing';
import { SavedGameController } from './saved-game.controller';
import { SavedGameService } from './saved-game.service';

describe('SavedGameController', () => {
  let controller: SavedGameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedGameController],
      providers: [SavedGameService],
    }).compile();

    controller = module.get<SavedGameController>(SavedGameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
