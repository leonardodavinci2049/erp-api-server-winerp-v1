import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { EndpointContextDto } from 'src/core/dto/endpoint-context.dto';

export class SupplierUpdGeneralFieldDto extends EndpointContextDto {
  @ApiProperty({
    description: 'Supplier ID (tbl_fornecedor.ID_FORNECEDOR)',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_register_id!: number;

  @ApiProperty({
    description: 'Field type: 1=string, 2=bigint, 3=decimal, 4=date',
    enum: [1, 2, 3, 4],
    example: 1,
  })
  @IsIn([1, 2, 3, 4])
  pe_field_type!: number;

  @ApiProperty({
    description:
      'Column name of tbl_fornecedor (letters, numbers and underscore only)',
    maxLength: 200,
    example: 'NOME',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'pe_field must contain only letters, numbers and underscore',
  })
  pe_field!: string;

  @ApiPropertyOptional({ description: 'Value for pe_field_type = 1' })
  @IsString()
  @IsOptional()
  pe_value_str?: string | null;

  @ApiPropertyOptional({ description: 'Value for pe_field_type = 2' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_value_int?: number | null;

  @ApiPropertyOptional({ description: 'Value for pe_field_type = 3' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_value_numeric?: number | null;

  @ApiPropertyOptional({
    description: 'Value for pe_field_type = 4 (YYYY-MM-DD)',
  })
  @IsString()
  @IsOptional()
  pe_value_date?: string | null;
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
  "pe_person_id": 1,
  "pe_register_id": 1,
  "pe_field_type": 1,
  "pe_field": "NOME",
  "pe_value_str": "Fornecedor Padrao API",
  "pe_value_int": null,
  "pe_value_numeric": null,
  "pe_value_date": null
}
*/
