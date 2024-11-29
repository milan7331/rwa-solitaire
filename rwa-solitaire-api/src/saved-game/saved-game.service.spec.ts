import { Test, TestingModule } from '@nestjs/testing';
import { SavedGameService } from './saved-game.service';

describe('SavedGameService', () => {
  let service: SavedGameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SavedGameService],
    }).compile();

    service = module.get<SavedGameService>(SavedGameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
