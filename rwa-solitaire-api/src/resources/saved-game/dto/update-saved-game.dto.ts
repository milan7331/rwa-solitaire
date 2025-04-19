import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import { CreateSavedGameDto } from './create-saved-game.dto';

export class UpdateSavedGameDto extends PartialType(CreateSavedGameDto) {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10)) // Auto-transform string numbers
    @IsNumber({ allowInfinity: false, allowNaN: false }, { message: 'id must be a valid number' })
    id?: number;
}