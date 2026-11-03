import { IsNumber, IsString } from 'class-validator';

import { EndpointContextDto } from '../../core/dto/endpoint-context.dto.js';

export class BrandFindSearchV2Dto extends EndpointContextDto {

  @IsString()
  pe_search!: string;

  @IsNumber()
  pe_inactive!: number;

  @IsNumber()
  pe_limit!: number;
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
  "pe_user_role": "saller",
  "pe_person_id": 29014,
  "pe_search": "",
  "pe_inactive": 0,
  "pe_limit": 10
}

*/
