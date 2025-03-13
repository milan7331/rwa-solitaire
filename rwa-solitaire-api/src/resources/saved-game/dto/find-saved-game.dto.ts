import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class FindSavedGameDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsNotEmpty()
    @IsBoolean()
    withDeleted: boolean = false;
}