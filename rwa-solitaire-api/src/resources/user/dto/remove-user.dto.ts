import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class RemoveUserDto {
    @IsOptional()
    @IsNumber()
    id?: number = undefined;

    @IsOptional()
    @IsString()
    @MinLength(6)
    username?: string = undefined;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string = undefined;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}