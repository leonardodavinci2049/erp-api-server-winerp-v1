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

export class SupplierUpdInternetV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier ID (tbl_fornecedor.ID_FORNECEDOR)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_supplier_id!: number;

  @ApiPropertyOptional({ description: 'Website; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 300)
  pe_website?: string | null;

  @ApiPropertyOptional({
    description: 'Instagram (TEXT); null clears the field',
  })
  @IsString()
  @IsOptional()
  pe_instagram?: string | null;

  @ApiPropertyOptional({ description: 'Map URL (TEXT); null clears the field' })
  @IsString()
  @IsOptional()
  pe_map?: string | null;

  @ApiPropertyOptional({ description: 'Facebook; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_facebook?: string | null;

  @ApiPropertyOptional({ description: 'Twitter; null clears the field' })
  @IsString()
  @IsOptional()
  @Length(0, 200)
  pe_twitter?: string | null;
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
  "pe_website": "https://www.site-exemplo.com.br",
  "pe_instagram": "@exemplo",
  "pe_map": "https://www.google.com/maps/place/Exemplo",
  "pe_facebook": "https://www.facebook.com/exemplo",
  "pe_twitter": "https://x.com/exemplo"
}
*/
