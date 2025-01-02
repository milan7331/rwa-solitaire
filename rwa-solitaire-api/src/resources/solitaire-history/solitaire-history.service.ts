import { Injectable } from '@nestjs/common';
import { CreateSolitaireHistoryDto } from './dto/create-solitaire-history.dto';
import { UpdateSolitaireHistoryDto } from './dto/update-solitaire-history.dto';
import { Between, Repository } from 'typeorm';
import { SolitaireHistory } from './entities/solitaire-history.entity';
import { CronService } from 'src/database/cron.service';

@Injectable()
export class SolitaireHistoryService {
  constructor(
    private readonly cronService: CronService,
    private readonly historyRepository: Repository<SolitaireHistory>
  ) {}

  async getAllGamesFromThisWeek(): Promise<[SolitaireHistory[], Date]> {
    const [weekStartDate, weekEndDate] = this.cronService.getCleanDateSpan_CurrentWeek();
    const games = await this.getAllGamesFromTimeSpan(weekStartDate, weekEndDate);
    return [games, weekStartDate];
  }
  
  async getAllGamesFromThisMonth(): Promise<[SolitaireHistory[], Date]> {
    const [monthStartDate, monthEndDate] = this.cronService.getCleanDateSpan_CurrentMonth();
    const games = await this.getAllGamesFromTimeSpan(monthStartDate, monthEndDate);
    return [games, monthStartDate];
  }
  
  async getAllGamesFromThisYear(): Promise<[SolitaireHistory[], Date]> {
    const [yearStartDate, yearEndDate] = this.cronService.getCleanDateSpan_CurrentYear();
    const games = await this.getAllGamesFromTimeSpan(yearStartDate, yearEndDate);
    return [games, yearStartDate];
  }


  private async getAllGamesFromTimeSpan(startDate: Date, endDate: Date): Promise<SolitaireHistory[]> {
    let results = [];
    try {
      results = await this.historyRepository.find({
        where: {
          createdAt: Between(startDate, endDate)
        }
      })
    } catch(error) {
      console.error('Error finding entities | SolitaireHistoryService, message: ' + error.message);
      results = [];
    }

    return results;
  }

  create(createSolitaireHistoryDto: CreateSolitaireHistoryDto) {
    return 'This action adds a new solitaireHistory';
  }

  findAll() {
    return `This action returns all solitaireHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solitaireHistory`;
  }

  update(id: number, updateSolitaireHistoryDto: UpdateSolitaireHistoryDto) {
    return `This action updates a #${id} solitaireHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} solitaireHistory`;
  }
}
