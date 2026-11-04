import { PartialType } from '@nestjs/mapped-types';
import { CreateDbOperationDto } from './create-db.operation.dto.js';

export class UpdateDbOperationDto extends PartialType(CreateDbOperationDto) {}
