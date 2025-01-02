import { IsDate, IsNotEmpty } from "class-validator";
import { UserData } from "../entities/userdata";

export class CreateLeaderboardDto {
    @IsNotEmpty()
    @IsDate()
    timePeriod: Date;

    @IsNotEmpty()
    top20_averageTime: UserData[];

    @IsNotEmpty()
    top20_bestTime: UserData[];

    @IsNotEmpty()
    top20_numberOfMoves: UserData[];

    @IsNotEmpty()
    top20_gamesPlayed: UserData[];
}
