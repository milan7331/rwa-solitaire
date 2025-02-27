import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";
import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";

export class CreateUserStatsDto {
    @IsNotEmpty()
    user: User;

    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    gamesPlayed: number = 0;

    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    gamesWon: number = 0;

    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    totalTimePlayed: number = 0;

    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    averageSolveTime: number = POSTGRES_MAX_INTEGER;

    @IsNumber()
    @Min(0)
    @Max(POSTGRES_MAX_INTEGER)
    fastestSolveTime: number = POSTGRES_MAX_INTEGER;    
}
