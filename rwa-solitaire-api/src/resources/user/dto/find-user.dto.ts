import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FindUserDto {
    @IsOptional()
    @IsNumber()
    id?: number;

    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    plainPassword?: string;

    @IsNotEmpty()
    @IsBoolean()
    withDeleted: boolean = false;

    @IsNotEmpty()
    @IsBoolean()
    withRelations: boolean = false;
}