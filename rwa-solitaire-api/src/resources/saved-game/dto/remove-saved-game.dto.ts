import { IsNumber, IsOptional } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";

export class RemoveSavedGameDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    user?: User;
}