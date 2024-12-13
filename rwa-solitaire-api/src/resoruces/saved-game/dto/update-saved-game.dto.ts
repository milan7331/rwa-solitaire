import { PartialType } from '@nestjs/mapped-types';
import { CreateSavedGameDto } from './create-saved-game.dto';

export class UpdateSavedGameDto extends PartialType(CreateSavedGameDto) {}
