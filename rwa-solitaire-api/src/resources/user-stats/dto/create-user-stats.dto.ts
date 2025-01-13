import { IsNotEmpty, isNumber, IsNumber, IsOptional } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";

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
    averageSolveTime: number = Number.MAX_SAFE_INTEGER;

    @IsOptional()
    @IsNumber()    
    fastestSolveTime: number = Number.MAX_SAFE_INTEGER;
    
}
