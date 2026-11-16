import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

export class SupplierFindManagerIdV2Dto extends BaseRequestDto {
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
  pe_supplier_id!: number;
}

/*
Sample JSON for testing in body endpoint:

{
  "PE_PASSKEY": "example-passkey",
  "PE_ID_DEPARTAMENTO": 0,
  "pe_app_id": 1,
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "pe_organization_id": "ORG001",
  "PE_ID_USUARIO": "USER001",
  "pe_user_name": "John Doe",
  "pe_user_role": "admin",
  "pe_person_id": 29014,
  "pe_supplier_id": 1
}

*/
