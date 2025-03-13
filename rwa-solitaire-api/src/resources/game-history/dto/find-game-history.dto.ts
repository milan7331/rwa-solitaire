import { IsBoolean, IsDate, IsNumber, IsOptional } from "class-validator";

export class FindGameHistoryDto {
        @IsOptional()
        @IsNumber()
        id?: number;

        @IsOptional()
        @IsNumber()
        userId?: number;

        @IsOptional()
        @IsDate()
        startedTime?: Date;

        @IsOptional()
        @IsBoolean()
        withDeleted: boolean = false;
}