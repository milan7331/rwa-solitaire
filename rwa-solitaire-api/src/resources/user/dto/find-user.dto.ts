import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class FindUserDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    @MinLength(6)
    username?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string;

    @IsNotEmpty()
    @IsBoolean()
    withDeleted: boolean = false;

    @IsNotEmpty()
    @IsBoolean()
    withRelations: boolean = false;
}