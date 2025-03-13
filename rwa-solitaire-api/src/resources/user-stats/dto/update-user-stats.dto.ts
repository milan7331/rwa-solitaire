import { PartialType } from '@nestjs/mapped-types';
import { CreateUserStatsDto } from './create-user-stats.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateUserStatsDto extends PartialType(CreateUserStatsDto) {
    @IsOptional()
    @IsNumber()
    id?: number;
}
