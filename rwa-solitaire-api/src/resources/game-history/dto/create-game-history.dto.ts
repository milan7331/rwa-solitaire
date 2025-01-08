import { IsDate, IsNotEmpty } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";
import { SolitaireDifficulty } from "../entities/game-history.entity";

export class CreateGameHistoryDto {
        @IsNotEmpty()
        gameDifficulty: SolitaireDifficulty;
    
        @IsNotEmpty()
        @IsDate()
        startedTime: Date;
        
        @IsNotEmpty()
        user: User;
}
