import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class FindUserStatsDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'userId must be a valid number' })
    userId?: number;

    @IsOptional()
    @Transform(({ value }) => value?.trim())
    @IsString({ message: 'username must be a string' })
    @MinLength(6, { message: 'username must be at least 6 characters long' })
    @MaxLength(32, { message: 'username cannot exceed 32 characters in length' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username can only contain letters, numbers, and underscores' })
    username?: string;

    @IsOptional()
    @IsBoolean({ message: 'withDeleted must be a valid boolean' })
    withDeleted: boolean = false;
}