import { PartialType } from '@nestjs/mapped-types';
import { CreateUserStatsDto } from './create-user-stats.dto';

export class UpdateUserStatsDto extends PartialType(CreateUserStatsDto) {}
