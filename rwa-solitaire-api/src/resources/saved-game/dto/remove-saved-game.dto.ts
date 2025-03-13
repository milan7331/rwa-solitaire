import { IsNumber, IsOptional } from "class-validator";

export class RemoveSavedGameDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsNumber()
    userId?: number;
}