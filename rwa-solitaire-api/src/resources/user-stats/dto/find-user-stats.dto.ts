import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";

export class FindUserStatsDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    user?: User;

    @IsNotEmpty()
    @IsBoolean()
    withDeleted: boolean;
}