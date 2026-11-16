import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

import { EndpointContextDto } from 'src/core/dto/endpoint-context.dto';

export class SupplierUpdInlTypePersonV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier ID (tbl_fornecedor.ID_FORNECEDOR)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_supplier_id!: number;

  @ApiProperty({
    description: 'Person type ID (tbl_fornecedor.ID_PESSOA_TIPO)',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_person_type_id!: number;
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
  "pe_supplier_id": 36973,
  "pe_person_type_id": 1
}
*/
