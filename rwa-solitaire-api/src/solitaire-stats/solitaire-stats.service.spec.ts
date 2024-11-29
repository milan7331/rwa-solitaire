import { Test, TestingModule } from '@nestjs/testing';
import { SolitaireStatsService } from './solitaire-stats.service';

describe('SolitaireStatsService', () => {
  let service: SolitaireStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SolitaireStatsService],
    }).compile();

    service = module.get<SolitaireStatsService>(SolitaireStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
