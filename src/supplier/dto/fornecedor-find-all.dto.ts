import { IsOptional, IsString, Min } from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

/**
 * Request of `fornecedor-find-all`, ported from `UpdateFornecedor`
 * (`UsvmFornecedor.pas`).
 */
export class FornecedorFindAllDto extends BaseRequestDto {
  @Min(1, { message: 'PE_ID_SYSTEM deve ser maior ou igual a 1.' })
  declare PE_ID_SYSTEM: number;

  @IsString()
  @IsOptional()
  PE_FORNECEDOR?: string | null;
}

/*
Sample JSON for testing in body endpoint:

{
  "PE_PASSKEY": "example-passkey",
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "USER001",
  "PE_FORNECEDOR": "FORNEC"
}

*/
