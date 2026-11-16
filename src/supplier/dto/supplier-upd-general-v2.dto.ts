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

export class SupplierUpdGeneralV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier ID (tbl_fornecedor.ID_FORNECEDOR)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_supplier_id!: number;

  @ApiProperty({
    description: 'Supplier name (NOME); required by the procedure',
    maxLength: 300,
    example: 'Fornecedor Exemplo Ltda',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 300)
  pe_name!: string;

  @ApiPropertyOptional({ description: 'Phone 1; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_phone1?: string | null;

  @ApiPropertyOptional({ description: 'WhatsApp 1; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_whatsapp1?: string | null;

  @ApiPropertyOptional({ description: 'Contact 1; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_contact1?: string | null;

  @ApiPropertyOptional({ description: 'Email 1; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_email1?: string | null;
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
  "pe_name": "Fornecedor Exemplo Ltda",
  "pe_phone1": "(11) 3000-0000",
  "pe_whatsapp1": "(11) 90000-0000",
  "pe_contact1": "Nome do Contato",
  "pe_email1": "contato@exemplo.com.br"
}
*/
