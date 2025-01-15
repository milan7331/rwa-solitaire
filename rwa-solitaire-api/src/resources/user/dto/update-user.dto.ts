import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsNumber()
    id?: number = undefined;
    
    @IsOptional()
    @IsString()
    @IsEmail()
    email?: string = undefined;

    @IsOptional()
    @IsString()
    @MinLength(6)
    username?: string = undefined;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string = undefined;

    @IsOptional()
    @IsString()
    @MinLength(8)
    newPassword?: string = undefined;
}
