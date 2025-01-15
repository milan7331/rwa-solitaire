import { IsDate, IsNumber, IsOptional } from "class-validator"
import { User } from "src/resources/user/entities/user.entity";

export class RemoveGameHistoryDto {
    @IsOptional()
    @IsNumber()
    id?: number = undefined;
    
    @IsOptional()
    user?: User = undefined;
    
    @IsOptional()
    @IsDate()
    startedTime?: Date = undefined;
}