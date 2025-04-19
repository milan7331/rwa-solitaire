import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional } from "class-validator";

export class FindGameHistoryDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a number' })
    id?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'userId must be a number' })
    userId?: number;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate({ message: 'startedTime must be a valid Date object'})
    startedTime?: Date;

    @IsOptional()
    @IsBoolean({ message: 'withDeleted must be a boolean' })
    withDeleted: boolean = false;
}
