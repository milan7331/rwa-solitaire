import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RemoveUserDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => value?.trim().toLowerCase())
    @IsString({ message: 'email must be a string' })
    @MinLength(6, { message: 'email must be at least 6 characters long'})
    @MaxLength(128, { message: 'email cannot exceed 128 characters in length'})
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email?: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsString({ message: 'username must be a string' })
    @MinLength(6, { message: 'username must be at least 6 characters long' })
    @MaxLength(32, { message: 'username cannot exceed 32 characters in length' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username can only contain letters, numbers, and underscores' })
    username?: string;

    @Transform(({ value }) => value?.trim())
    @IsNotEmpty({ message: 'password is required for account deletion' })
    @IsString({ message: 'password must be a string' })
    @MinLength(8, { message: 'password must be at least 8 characters long' })
    @MaxLength(64, { message: 'password cannot exceed 64 characters in length' })
    @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'password must contain at least one lowercase letter' })
    @Matches(/\d/, { message: 'password must contain at least one number' })
    @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'password must contain at least one special character' })
    password: string;
}