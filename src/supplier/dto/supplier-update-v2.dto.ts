import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { EndpointContextDto } from 'src/core/dto/endpoint-context.dto';

export class SupplierUpdateV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier ID' })
  @IsNumber()
  pe_supplier_id!: number;

  @ApiProperty({ description: 'Supplier', maxLength: 100 })
  @IsString()
  pe_supplier!: string;

  @ApiProperty({ description: 'Notes' })
  @IsString()
  pe_notes!: string;

  @ApiProperty({ description: 'Inactive' })
  @IsNumber()
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
  "pe_supplier_id": 123,
  "pe_supplier": "Updated Supplier Name",
  "pe_notes": "Some notes about the supplier",
  "pe_inactive": 0
}

*/
