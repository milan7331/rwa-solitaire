import { User } from "src/resources/user/entities/user.entity";

export class RemoveUserStatsDto {
    id?: number;
    user?: User;
}