import { Transform } from 'class-transformer';
import { IsNumber, IsObject, IsOptional } from 'class-validator';

export class UpdateSavedGameDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;

    @IsOptional()
    @IsObject({ message: 'gamestate must be a plain object' })
    gameState?: Record<string, any> = {};

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'userId must be a valid number' })
    userId?: number;
}