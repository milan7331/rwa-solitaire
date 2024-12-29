import { Test, TestingModule } from '@nestjs/testing';
import { SolitaireHistoryService } from './solitaire-history.service';

describe('SolitaireHistoryService', () => {
  let service: SolitaireHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolitaireHistoryService],
    }).compile();

    service = module.get<SolitaireHistoryService>(SolitaireHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
