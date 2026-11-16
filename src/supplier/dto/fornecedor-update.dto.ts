import { IsNumber, IsOptional, IsString } from 'class-validator';

import { FornecedorPayloadDto } from './fornecedor-payload.dto.js';

/**
 * Request of `fornecedor-update`, ported from `acceptFornecedorV1`
 * (`UsvmFornecedor.pas`).
 */
export class FornecedorUpdateDto extends FornecedorPayloadDto {
  @IsNumber()
  PE_ID_FORNECEDOR!: number;

  @IsString()
  @IsOptional()
  PE_NOME?: string | null;
}

/*
Sample JSON for testing in body endpoint:

{
  "pePassKey": "",
  "peIdSystem": 1,
  "peIdLoja": 1,
  "peIdDepartamento": 0,
  "peIdUsuario": 0,
  "PE_ID_FORNECEDOR": 1,
  "PE_NOME": "FORNECEDOR PADRAO API",
  "PE_FISIJURI": "J",
  "PE_CNPJ": "00000000000100",
  "PE_RAZAO_SOCIAL": "FORNECEDOR PADRAO API LTDA",
  "PE_UF": "SP"
}

*/
