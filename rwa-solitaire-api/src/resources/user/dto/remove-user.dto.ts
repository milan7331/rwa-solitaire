import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class RemoveUserDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    @MinLength(6)
    username?: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    password: string;
}