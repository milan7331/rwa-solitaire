import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsObject } from "class-validator";
import { SolitaireDifficulty } from "../entities/game-history.entity";

export class CreateGameHistoryDto {
        @IsNotEmpty()
        @IsEnum(SolitaireDifficulty)
        gameDifficulty: SolitaireDifficulty;
    
        @IsNotEmpty()
        @IsDate()
        startedTime: Date;
        
        @IsNotEmpty()
        @IsNumber()
        userId: number;
}
