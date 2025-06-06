import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { LeaderboardType } from "src/resources/leaderboard/entities/leaderboard.enum";
import { LeaderboardService } from "src/resources/leaderboard/leaderboard.service";
import { UserService } from "src/resources/user/user.service";

@Injectable()
export class CronService {
    constructor(
        private readonly userService: UserService,
        @Inject(forwardRef(() => LeaderboardService)) private readonly leaderboardService: LeaderboardService
    ) {}

    // This method runs once a day to clean up old soft removed/deleted user accounts and all related rows.
    @Cron(CronExpression.EVERY_DAY_AT_10AM, { name: 'dbCleanUp' })
    private async dbCleanUp() {
        this.userService.permanentlyRemoveOldUsers();
    }

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

    getCleanDateSpan_CurrentWeek(): [Date, Date] {
        const currentDate = new Date();

        const weekStartDate = new Date(currentDate);
        weekStartDate.setDate(currentDate.getDate() - currentDate.getDay()); // Set to Sunday of the current week
        weekStartDate.setHours(0, 0, 0, 0); // Set time to midnight

        const weekEndDate: Date = new Date(weekStartDate);
        weekEndDate.setDate(weekStartDate.getDate() + 6);
        weekEndDate.setHours(23, 59, 59, 999);

        return [weekStartDate, weekEndDate];
    }

    getCleanDateSpan_CurrentMonth(): [Date, Date] {
        const currentDate = new Date();
        
        const monthStartDate = new Date(currentDate);
        monthStartDate.setDate(1);
        monthStartDate.setHours(0, 0, 0, 0);
    
        const monthEndDate = new Date(monthStartDate);
        monthEndDate.setMonth(monthStartDate.getMonth() + 1); // Move to the next month
        monthEndDate.setDate(0); // Set to the last day of the previous month
        monthEndDate.setHours(23, 59, 59, 999);
    
        return [monthStartDate, monthEndDate];
    }
    
    getCleanDateSpan_CurrentYear(): [Date, Date] {
        const currentDate = new Date();
    
        const yearStartDate = new Date(currentDate);
        yearStartDate.setMonth(0); // January (0-indexed)
        yearStartDate.setDate(1);
        yearStartDate.setHours(0, 0, 0, 0);
    
        const yearEndDate = new Date(yearStartDate);
        yearEndDate.setFullYear(yearStartDate.getFullYear() + 1); // Move to the next year
        yearEndDate.setMonth(0); // January of the next year
        yearEndDate.setDate(0); // Last day of the previous year
        yearEndDate.setHours(23, 59, 59, 999);
    
        return [yearStartDate, yearEndDate];
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => { setTimeout(resolve, ms); })
    }
    
}