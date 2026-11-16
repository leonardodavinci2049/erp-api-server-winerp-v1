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

export class SupplierUpdBusinessV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier ID (tbl_fornecedor.ID_FORNECEDOR)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_supplier_id!: number;

  @ApiPropertyOptional({
    description: 'Legal name (RAZAO_SOCIAL); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 300)
  pe_legal_name?: string | null;

  @ApiPropertyOptional({
    description: 'Trade name (NOME_FANTASIA); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_trade_name?: string | null;

  @ApiPropertyOptional({
    description:
      'Company tax ID registration date (YYYY-MM-DD); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'pe_company_registration_date must be in YYYY-MM-DD format',
  })
  pe_company_registration_date?: string | null;

  @ApiPropertyOptional({
    description: 'Company tax ID (CNPJ); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  pe_company_tax_id?: string | null;

  @ApiPropertyOptional({
    description: 'State registration (INSC_ESTADUAL); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  pe_state_registration?: string | null;

  @ApiPropertyOptional({
    description:
      'Municipal registration (INSC_MUNICIPAL); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 100)
  pe_municipal_registration?: string | null;

  @ApiPropertyOptional({
    description:
      'Representative name (NOME_RESPONSAVEL); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_representative_name?: string | null;

  @ApiPropertyOptional({
    description:
      'Representative position (CARGO_RESPOSNAVEL); null clears the field',
  })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_representative_position?: string | null;
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
  "pe_legal_name": "Distribuidora Exemplo Ltda",
  "pe_trade_name": "Distribuidora Exemplo",
  "pe_company_registration_date": "2011-03-15",
  "pe_company_tax_id": "18.987.654/0001-30",
  "pe_state_registration": "987.654.321.012",
  "pe_municipal_registration": "9.876.543-2",
  "pe_representative_name": "Nome do Responsavel",
  "pe_representative_position": "Diretor Comercial"
}
*/
