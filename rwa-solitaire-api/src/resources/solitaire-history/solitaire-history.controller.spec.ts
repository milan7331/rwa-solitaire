import { Test, TestingModule } from '@nestjs/testing';
import { SolitaireHistoryController } from './solitaire-history.controller';
import { SolitaireHistoryService } from './solitaire-history.service';

describe('SolitaireHistoryController', () => {
  let controller: SolitaireHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolitaireHistoryController],
      providers: [SolitaireHistoryService],
    }).compile();

    controller = module.get<SolitaireHistoryController>(SolitaireHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
