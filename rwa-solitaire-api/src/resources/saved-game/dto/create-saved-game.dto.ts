import { Optional } from "@nestjs/common";
import { IsNotEmpty } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";

export class CreateSavedGameDto {

    gameState: Record<string, any> = {};
    
    @IsNotEmpty()
    user: User;
}
