import { PartialType } from '@nestjs/mapped-types';
import { CreateSavedGameDto } from './create-saved-game.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSavedGameDto extends PartialType(CreateSavedGameDto) {
    @IsOptional()
    @IsNumber()
    id?: number = undefined;
}
