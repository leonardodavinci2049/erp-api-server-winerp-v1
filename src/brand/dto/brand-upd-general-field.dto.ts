import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { EndpointContextDto } from '../../core/dto/endpoint-context.dto.js';

export class BrandUpdGeneralFieldDto extends EndpointContextDto {

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_register_id!: number;

  @IsIn([1, 2, 3, 4])
  pe_field_type!: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'pe_field must contain only letters, numbers and underscore',
  })
  pe_field!: string;

  @IsString()
  @IsOptional()
  pe_value_str?: string | null;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_value_int?: number | null;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_value_numeric?: number | null;

  @IsString()
  @IsOptional()
  pe_value_date?: string | null;
}
/*
Sample JSON for testing in body endpoint:
{
  "pe_app_id": 1,
  "pe_system_client_id": 1,
  "pe_store_id": 1,
  "pe_organization_id": "ORG001",
  "pe_user_id": "USER001",
  "pe_user_name": "John Doe",
  "pe_user_role": "admin",
  "pe_person_id": 1,
  "pe_register_id": 10,
  "pe_field_type": 1,
  "pe_field": "NOME",
  "pe_value_str": "AFNAN-TESTE-API",
  "pe_value_int": null,
  "pe_value_numeric": null,
  "pe_value_date": null
}
*/
