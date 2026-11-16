import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { EndpointContextDto } from 'src/core/dto/endpoint-context.dto';

export class SupplierFindAllDto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier ID', required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_id_fornecedor?: number;

  @ApiProperty({
    description: 'Supplier name',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  pe_fornecedor?: string;

  @ApiProperty({ description: 'Result limit', required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_limit?: number;
}

/*
Sample JSON for testing:
{
  "pe_app_id": 1,
  "pe_system_client_id": 100,
  "pe_store_id": 5,
  "pe_organization_id": "ORG_12345",
  "pe_member_id": "MBR_67890",
  "pe_user_id": "USR_54321",
  "pe_person_id": 999,
  "pe_id_fornecedor": 50,
  "pe_fornecedor": "Fornecedor ABC",
  "pe_limit": 100
}
*/
