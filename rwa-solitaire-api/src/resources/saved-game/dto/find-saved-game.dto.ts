import { IsBoolean, IsNumber, IsOptional } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";

export class FindSavedGameDto {
    @IsOptional()
    @IsNumber()
    id?: number = undefined;

    @IsOptional()
    user?: User = undefined;

    @IsBoolean()
    withDeleted: boolean = false;
}