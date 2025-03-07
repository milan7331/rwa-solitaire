import { IsNumber, IsOptional } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";

export class RemoveUserStatsDto {
    @IsOptional()
    @IsNumber()
    id?: number = undefined;

    @IsOptional()
    user?: User = undefined;
}