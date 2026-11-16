import { IsNumber, Min } from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

/**
 * Request of `fornecedor-delete`, ported from `cancelFornecedorV1`
 * (`UsvmFornecedor.pas`). The legacy method receives the id as a separate
 * parameter; over HTTP it is sent in the JSON body.
 */
export class FornecedorDeleteDto extends BaseRequestDto {
  @Min(1, { message: 'PE_ID_SYSTEM deve ser maior ou igual a 1.' })
  declare PE_ID_SYSTEM: number;

  @IsNumber()
  PE_ID_FORNECEDOR!: number;
}

/*
Sample JSON for testing in body endpoint:

{
  "PE_PASSKEY": "example-passkey",
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "USER001",
  "PE_ID_FORNECEDOR": 1
}

*/
