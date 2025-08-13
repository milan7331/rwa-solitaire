import { Injectable } from "@nestjs/common";
import { LeaderboardService } from "./leaderboard.service";
import { LeaderboardType } from "./entities/leaderboard.enum";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class LeaderboardUpdaterService {
    constructor(
        private readonly leaderboardService: LeaderboardService
    ) {}

    @Cron(CronExpression.EVERY_10_MINUTES, { name: 'weeklyLeaderboardUpdate'})
    private async updateWeeklyLeaderboard(): Promise<void> {
        await this.leaderboardService.leaderboardRefresh(LeaderboardType.WEEKLY);
    }

    @Cron(CronExpression.EVERY_HOUR, { name: 'monthlyLeaderboardUpdate'})
    private async updateMonthlyLeaderboard(): Promise<void> {
        await this.leaderboardService.leaderboardRefresh(LeaderboardType.MONTHLY);
    }

    @Cron(CronExpression.EVERY_DAY_AT_10AM, { name: 'yearlyLeaderboardUpdate'})
    private async updateYearlyLeaderboard(): Promise<void> {
        await this.leaderboardService.leaderboardRefresh(LeaderboardType.YEARLY);
    }
}