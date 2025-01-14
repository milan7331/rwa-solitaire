import { forwardRef, Module } from "@nestjs/common";
import { CronService } from "./cron.service";
import { UserModule } from "src/resources/user/user.module";
import { LeaderboardModule } from "src/resources/leaderboard/leaderboard.module";

@Module({
    imports: [
        UserModule,
        forwardRef(() => LeaderboardModule)
    ],
    providers: [CronService],
    exports: [CronService]
})
export class UtilModule {}