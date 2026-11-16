import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

import { EndpointContextDto } from 'src/core/dto/endpoint-context.dto';

export class SupplierFindSearchV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Search term', maxLength: 300 })
  @IsString()
  @MaxLength(300)
  pe_search!: string;
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
  "pe_search": "36959"
}

*/
