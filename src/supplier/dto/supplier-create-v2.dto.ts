import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { EndpointContextDto } from 'src/core/dto/endpoint-context.dto';

export class SupplierCreateV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier', maxLength: 100 })
  @IsString()
  pe_supplier_name!: string;

  @ApiProperty({ description: 'Slug', maxLength: 300 })
  @IsString()
  pe_slug!: string;
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
  "pe_supplier_name": "Supplier Name",
  "pe_slug": "supplier-name"

}


*/
