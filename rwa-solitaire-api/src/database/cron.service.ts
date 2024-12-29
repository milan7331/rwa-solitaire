import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UserService } from "src/resources/user/user.service";



@Injectable()
export class CronService {
    constructor(private readonly userService: UserService) {}

    // This method runs once a day to clean up old soft removed/deleted user accounts and all related rows
    @Cron(CronExpression.EVERY_DAY_AT_10AM, { name: 'dbCleanUp' })
    dbCleanUp() {
        this.userService.permanentlyRemoveOldUsers();
    }
}