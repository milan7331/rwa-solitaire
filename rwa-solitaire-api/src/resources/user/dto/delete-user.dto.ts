import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class DeleteUserDto {

    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    password: string;
}