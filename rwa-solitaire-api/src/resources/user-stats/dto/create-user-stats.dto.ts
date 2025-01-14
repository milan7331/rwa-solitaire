import { IsNotEmpty, isNumber, IsNumber, IsOptional } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";
import { POSTGRES_MAX_INTEGER } from "src/util/postgres-constants";

export class CreateUserStatsDto {

    @IsNotEmpty()
    user: User;

    @IsOptional()
    @IsNumber()
    gamesPlayed: number = 0;
      
    @IsOptional()
    @IsNumber()
    gamesWon: number = 0;

    @IsOptional()
    @IsNumber()
    totalTimePlayed: number = 0;

    @IsOptional()
    @IsNumber()
    averageSolveTime: number = POSTGRES_MAX_INTEGER;

    @IsOptional()
    @IsNumber()    
    fastestSolveTime: number = POSTGRES_MAX_INTEGER;
    
}
