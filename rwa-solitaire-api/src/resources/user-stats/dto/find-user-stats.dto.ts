import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class FindUserStatsDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({  allowInfinity: false, allowNaN: false}, { message: 'userId must be a valid number' })
    userId: number;

    @IsOptional()
    @IsBoolean({ message: 'withDeleted must be a valid boolean' })
    withDeleted: boolean = false;
}