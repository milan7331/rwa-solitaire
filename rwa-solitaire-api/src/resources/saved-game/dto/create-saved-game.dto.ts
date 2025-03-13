import { IsNotEmpty, IsNumber, IsObject } from "class-validator";

export class CreateSavedGameDto {
    @IsNotEmpty()
    gameState: Record<string, any> = {};
    
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}
