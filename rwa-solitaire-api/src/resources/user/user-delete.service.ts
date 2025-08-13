import { Injectable } from "@nestjs/common";
import { UserService } from "./user.service";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class UserDeleteService {
    constructor(
        private readonly userService: UserService,
    ) {}

    // This method runs once a day to clean up old soft removed/deleted user accounts and all related rows.
    @Cron(CronExpression.EVERY_DAY_AT_10AM, { name: 'dbCleanUp' })
    private async dbCleanUp() {
        this.userService.permanentlyRemoveOldUsers();
    }
}