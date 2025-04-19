import { Transform } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class RemoveSavedGameDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'userId must be a valid number' })
    userId?: number;
}