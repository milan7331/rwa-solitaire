import { PartialType } from '@nestjs/mapped-types';
import { CreateSolitaireStatsDto } from './create-solitaire-stats.dto';

export class UpdateSolitaireStatsDto extends PartialType(CreateSolitaireStatsDto) {}
