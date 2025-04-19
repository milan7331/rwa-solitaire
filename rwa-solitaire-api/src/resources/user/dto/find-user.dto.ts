import { Transform } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class FindUserDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => value?.trim().toLowerCase())
    @IsString({ message: 'email must be a string' })
    @IsEmail({}, { message: 'Please provide a valid Email address' })
    email?: string;

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsString({ message: 'username must be a string' })
    @MinLength(6, { message: 'username must be at least 6 characters' })
    @MaxLength(32, { message: 'username cannot exceed 32 characters' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username can only contain letters, numbers, and underscores' })
    username?: string;

    @IsOptional()
    @IsString({ message: 'password must be a string' })
    @Transform(({ value }) => value?.trim())
    @MinLength(8, { message: 'password must be at least 8 characters' })
    @MaxLength(64, { message: 'password cannot exceed 64 characters' })
    @Matches(/[A-Z]/, { message: 'password must contain at least one uppercase letter' })
    @Matches(/[a-z]/, { message: 'password must contain at least one lowercase letter' })
    @Matches(/\d/, { message: 'password must contain at least one number' })
    @Matches(/[!@#$%^&*(),.?":{}|<>]/, {  message: 'password must contain at least one special character'  })
    password?: string;

    @IsOptional()
    @IsBoolean({ message: 'withDeleted must be a boolean' })
    withDeleted: boolean = false;

    @IsOptional()
    @IsBoolean({ message: 'withRelations must be a boolean' })
    withRelations: boolean = false;
}