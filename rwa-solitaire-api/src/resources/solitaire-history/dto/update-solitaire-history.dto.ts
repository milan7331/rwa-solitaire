import { PartialType } from '@nestjs/mapped-types';
import { CreateSolitaireHistoryDto } from './create-solitaire-history.dto';

export class UpdateSolitaireHistoryDto extends PartialType(CreateSolitaireHistoryDto) {}
