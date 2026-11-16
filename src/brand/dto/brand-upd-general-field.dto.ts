import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

export class BrandUpdGeneralFieldDto extends BaseRequestDto {
  @IsNumber({}, { message: 'App ID deve ser um número.' })
  @IsNotEmpty({ message: 'App ID é obrigatório.' })
  pe_app_id!: number;

  @IsString({ message: 'Organization ID deve ser um texto.' })
  @IsNotEmpty({ message: 'Organization ID é obrigatório.' })
  pe_organization_id!: string;

  @IsString({ message: 'User Name deve ser um texto.' })
  @IsNotEmpty({ message: 'User Name é obrigatório.' })
  pe_user_name!: string;

  @IsString({ message: 'User Role deve ser um texto.' })
  @IsNotEmpty({ message: 'User Role é obrigatório.' })
  pe_user_role!: string;

  @IsOptional()
  @IsNumber({}, { message: 'Person ID deve ser um número.' })
  pe_person_id?: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  pe_register_id!: number;

  @IsIn([1, 2, 3, 4])
  pe_field_type!: number;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'pe_field must contain only letters, numbers and underscore',
  })
  pe_field!: string;

  @IsString()
  @IsOptional()
  pe_value_str?: string | null;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_value_int?: number | null;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pe_value_numeric?: number | null;

  @IsString()
  @IsOptional()
  pe_value_date?: string | null;
}
/*
Sample JSON for testing in body endpoint:
{
  "PE_ID_DEPARTAMENTO": 0,
  "pe_app_id": 1,
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "pe_organization_id": "ORG001",
  "PE_ID_USUARIO": 1,
  "pe_user_name": "John Doe",
  "pe_user_role": "admin",
  "pe_person_id": 1,
  "pe_register_id": 10,
  "pe_field_type": 1,
  "pe_field": "NOME",
  "pe_value_str": "AFNAN-TESTE-API",
  "pe_value_int": null,
  "pe_value_numeric": null,
  "pe_value_date": null
}
*/
