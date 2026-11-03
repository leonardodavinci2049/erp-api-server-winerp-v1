import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { EndpointContextDto } from '../../core/dto/endpoint-context.dto.js';

export class BrandUpdInlSlugV2Dto extends EndpointContextDto {

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_brand_id!: number;

  @IsString()
  @IsOptional()
  @Length(0, 300)
  pe_slug?: string | null;
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
  "pe_person_id": 29014,
  "pe_brand_id": 1,
  "pe_slug": "marca-exemplo"
}
*/
