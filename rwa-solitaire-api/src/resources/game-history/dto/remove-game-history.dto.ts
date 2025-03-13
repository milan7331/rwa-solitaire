import { IsDate, IsNumber, IsOptional } from "class-validator"

export class RemoveGameHistoryDto {
    @IsOptional()
    @IsNumber()
    id?: number;
    
    @IsOptional()
    @IsNumber()
    userId?: number;
    
    @IsOptional()
    @IsDate()
    startedTime?: Date;
}