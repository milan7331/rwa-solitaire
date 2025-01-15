import { IsBoolean, IsNumber, IsOptional } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";

export class FindSavedGameDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    user?: User;

    @IsOptional()
    @IsBoolean()
    withDeleted: boolean = false;
}