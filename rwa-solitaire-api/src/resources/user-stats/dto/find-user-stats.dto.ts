import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class FindUserStatsDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsNumber()
    userId?: number;

    @IsBoolean()
    withDeleted: boolean = false;
}