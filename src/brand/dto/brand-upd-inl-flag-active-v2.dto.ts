import { Type } from 'class-transformer';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

import { EndpointContextDto } from '../../core/dto/endpoint-context.dto.js';

export class BrandUpdInlFlagActiveV2Dto extends EndpointContextDto {

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_brand_id!: number;

  @IsIn([0, 1])
  @Type(() => Number)
  pe_inactive!: number;
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
  "pe_inactive": 0
}
*/
