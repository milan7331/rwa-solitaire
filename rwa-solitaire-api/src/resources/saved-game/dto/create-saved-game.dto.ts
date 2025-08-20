import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsObject } from "class-validator";

export class CreateSavedGameDto {
    @IsNotEmpty({ message: 'gameState is required' })
    @IsObject({ message: 'gamestate must be a plain object' })
    gameState: Record<string, any> = {};

    @Transform(({ value }) => parseInt(value, 10))
    @IsNotEmpty({ message: 'userId is required'})
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'userId must be a valid number' })
    userId: number;
}
