import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
    @Transform(({ value }) => value?.trim().toLowerCase())
    @IsNotEmpty({ message: 'email address is required' })
    @IsString({ message: 'email must be a string' })
    @MinLength(6, { message: 'email must be at least 6 characters long'})
    @MaxLength(128, { message: 'email cannot exceed 128 characters in length'})
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @Transform(({ value }) => value?.trim())
    @IsNotEmpty({ message: 'username is required' })
    @IsString({ message: 'username must be a string' })
    @MinLength(6, { message: 'username must be at least 6 characters long' })
    @MaxLength(32, { message: 'username cannot exceed 32 characters in length' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username can only contain letters, numbers, and underscores' })
    username: string;

    @Transform(({ value }) => value?.trim())
    @IsNotEmpty({ message: 'password is required' })
    @IsString({ message: 'password must be a string' })
    @MinLength(8, { message: 'password must be at least 8 characters long' })
    @MaxLength(64, { message: 'password cannot exceed 64 characters in length' })
    @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'password must contain at least one lowercase letter' })
    @Matches(/\d/, { message: 'password must contain at least one number' })
    @Matches(/[!@#$%^&*(),.?":]/, {  message: 'password must contain at least one special character'  })
    password: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
    @IsString({ message: 'firstname must be a string' })
    @MinLength(2, { message: 'firstname must be at least 2 characters long' })
    @MaxLength(64, { message: 'firstname cannot exceed 64 characters in length' })
    @Matches(/^[\p{L}\-'’\s]+$/u, { message: 'firstname can only contain letters, hyphens (-), and apostrophes (\')' })
    firstname?: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
    @IsString({ message: 'lastname must be a string' })
    @MinLength(2, { message: 'lastname must be at least 2 characters long' })
    @MaxLength(64, { message: 'lastname cannot exceed 64 characters in length' })
    @Matches(/^[\p{L}\-'’\s]+$/u, { message: 'lastname can only contain letters, hyphens (-), and apostrophes (\')' })
    lastname?: string;
}
