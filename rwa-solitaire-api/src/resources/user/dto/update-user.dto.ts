import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsNumber()
    id?: number;
    
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(6)
    username?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    newPassword?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    firstname?: string;

    @IsOptional()
    @IsString()
    @MinLength(2)
    lastname?: string;
}
