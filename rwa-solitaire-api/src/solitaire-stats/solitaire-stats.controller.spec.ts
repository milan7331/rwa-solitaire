import { Test, TestingModule } from '@nestjs/testing';
import { SolitaireStatsController } from './solitaire-stats.controller';
import { SolitaireStatsService } from './solitaire-stats.service';

describe('SolitaireStatsController', () => {
  let controller: SolitaireStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolitaireStatsController],
      providers: [SolitaireStatsService],
    }).compile();

    controller = module.get<SolitaireStatsController>(SolitaireStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
