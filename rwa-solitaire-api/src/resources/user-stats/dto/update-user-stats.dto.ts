import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { CreateUserStatsDto } from './create-user-stats.dto';

export class UpdateUserStatsDto extends PartialType(CreateUserStatsDto) {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;
}
