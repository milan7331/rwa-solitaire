import { IsNotEmpty } from "class-validator";
import { User } from "src/resources/user/entities/user.entity";

export class CreateUserStatsDto {

    @IsNotEmpty()
    user: User;
}
