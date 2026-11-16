import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import { EndpointContextDto } from 'src/core/dto/endpoint-context.dto';

export class SupplierUpdAddressV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier ID (tbl_fornecedor.ID_FORNECEDOR)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_supplier_id!: number;

  @ApiPropertyOptional({ description: 'Postal code; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  pe_postal_code?: string | null;

  @ApiPropertyOptional({ description: 'Street address; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 300)
  pe_address?: string | null;

  @ApiPropertyOptional({ description: 'Address number; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  pe_address_number?: string | null;

  @ApiPropertyOptional({
    description: 'Address complement; null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 300)
  pe_address_complement?: string | null;

  @ApiPropertyOptional({ description: 'Neighborhood; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_neighborhood?: string | null;

  @ApiPropertyOptional({ description: 'City; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_city?: string | null;

  @ApiPropertyOptional({
    description: 'State abbreviation; null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  pe_state_abbreviation?: string | null;

  @ApiPropertyOptional({
    description: 'Country region; null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_country_region?: string | null;

  @ApiPropertyOptional({ description: 'Country; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_country?: string | null;

  @ApiPropertyOptional({
    description: 'Municipality code (IBGE); null clears the field',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_municipality_code?: number | null;

  @ApiPropertyOptional({
    description: 'State code (IBGE); null clears the field',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_state_code?: number | null;
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
  "pe_postal_code": "05407-002",
  "pe_address": "Rua Exemplo de Teste",
  "pe_address_number": "2365",
  "pe_address_complement": "Galpao 3",
  "pe_neighborhood": "Pinheiros",
  "pe_city": "Sao Paulo",
  "pe_state_abbreviation": "SP",
  "pe_country_region": "Sudeste",
  "pe_country": "Brasil",
  "pe_municipality_code": 3550308,
  "pe_state_code": 35
}
*/
