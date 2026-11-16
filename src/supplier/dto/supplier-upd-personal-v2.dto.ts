import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { EndpointContextDto } from 'src/core/dto/endpoint-context.dto';

export class SupplierUpdPersonalV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier ID (tbl_fornecedor.ID_FORNECEDOR)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_supplier_id!: number;

  @ApiPropertyOptional({ description: 'First name; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  pe_first_name?: string | null;

  @ApiPropertyOptional({
    description: 'Personal tax ID (CPF); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  pe_personal_tax_id?: string | null;

  @ApiPropertyOptional({
    description: 'Identity document number (RG); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  pe_identity_document_number?: string | null;

  @ApiPropertyOptional({
    description: 'Birth date (YYYY-MM-DD); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'pe_birth_date must be in YYYY-MM-DD format',
  })
  pe_birth_date?: string | null;
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
  "pe_first_name": "Nome",
  "pe_personal_tax_id": "123.456.789-00",
  "pe_identity_document_number": "12.345.678-9",
  "pe_birth_date": "1979-07-23"
}
*/
