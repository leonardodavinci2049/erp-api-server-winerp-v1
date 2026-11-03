import { IsNumber, IsString } from 'class-validator';

import { EndpointContextDto } from '../../core/dto/endpoint-context.dto.js';

export class BrandFindManagerAllV2Dto extends EndpointContextDto {

  @IsString()
  pe_search!: string;

  @IsNumber()
  pe_inactive!: number;

  @IsNumber()
  pe_qt_records!: number;

  @IsNumber()
  pe_page_id!: number;

  @IsNumber()
  pe_column_id!: number;

  @IsNumber()
  pe_order_id!: number;
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
  "pe_qt_records": 2,
  "pe_page_id": 0,
  "pe_column_id": 2,
  "pe_order_id": 2
}

*/
