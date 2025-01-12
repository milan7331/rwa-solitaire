import { IsDate, IsNumber, IsOptional } from "class-validator"
import { User } from "src/resources/user/entities/user.entity";

export class RemoveGameHistoryDto {
    @IsOptional()
    @IsNumber()
    id?: number;
    
    @IsOptional()
    user?: User;
    
    @IsOptional()
    @IsDate()
    startedTime?: Date;
}