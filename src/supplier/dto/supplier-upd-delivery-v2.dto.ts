import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

import { EndpointContextDto } from 'src/core/dto/endpoint-context.dto';

export class SupplierUpdDeliveryV2Dto extends EndpointContextDto {
  @ApiProperty({ description: 'Supplier ID (tbl_fornecedor.ID_FORNECEDOR)' })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_supplier_id!: number;

  @ApiPropertyOptional({
    description: 'Delivery time in days; null clears the field',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_delivery_time_days?: number | null;

  @ApiPropertyOptional({
    description: 'Delivery time in hours; null clears the field',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_delivery_time_hours?: number | null;
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
  "pe_delivery_time_days": 5,
  "pe_delivery_time_hours": 8
}
*/
