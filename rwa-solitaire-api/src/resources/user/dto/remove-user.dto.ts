import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class RemoveUserDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsNotEmpty()
    @MinLength(8)
    plainPassword: string;
}