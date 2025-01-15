import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class FindUserDto {
    @IsOptional()
    @IsNumber()
    id?: number = undefined;

    @IsOptional()
    @IsString()
    @MinLength(6)
    username?: string = undefined;

    @IsOptional()
    @IsString()
    email?: string = undefined;

    @IsOptional()
    @IsString()
    @MinLength(8)
    password?: string = undefined;

    @IsNotEmpty()
    @IsBoolean()
    withDeleted: boolean = false;

    @IsNotEmpty()
    @IsBoolean()
    withRelations: boolean = false;
}