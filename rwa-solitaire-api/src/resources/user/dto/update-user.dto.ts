import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
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

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsString({ message: 'Current password must be a string' })
    @MinLength(8, { message: 'Current password must be at least 8 characters' })
    @MaxLength(64, { message: 'Current password cannot exceed 64 characters in length' })
    password?: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsString({ message: 'New password must be a string' })
    @MinLength(8, { message: 'New password must be at least 8 characters long' })
    @MaxLength(64, { message: 'New password cannot exceed 64 characters' })
    @Matches(/[A-Z]/, { message: 'New password must contain at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'New password must contain at least one lowercase letter' })
    @Matches(/\d/, { message: 'New password must contain at least one number' })
    @Matches(/[!@#$%^&*(),.?":{}|<>]/, { message: 'New password must contain at least one special character' })
    newPassword?: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
    @IsString({ message: 'firstname must be a string' })
    @MinLength(2, { message: 'firstname must be at least 2 characters long' })
    @MaxLength(64, { message: 'firstname cannot exceed 64 characters in length' })
    @Matches(/^[\p{L}\-'\s]+$/u, { message: 'firstname can only contain letters, hyphens, and apostrophes' })
    firstname?: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
    @IsString({ message: 'lastname must be a string' })
    @MinLength(2, { message: 'lastname must be at least 2 characters long' })
    @MaxLength(64, { message: 'lastname cannot exceed 64 characters in length' })
    @Matches(/^[\p{L}\-'\s]+$/u, { message: 'lastname can only contain letters, hyphens, and apostrophes' })
    lastname?: string;
}
