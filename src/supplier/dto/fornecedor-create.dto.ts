import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { FornecedorPayloadDto } from './fornecedor-payload.dto.js';

/**
 * Request of `fornecedor-create`, ported from `updateFornecedorV1`
 * (`UsvmFornecedor.pas`).
 */
export class FornecedorCreateDto extends FornecedorPayloadDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'PE_NOME deve ter no mínimo 5 caracteres.' })
  PE_NOME!: string;
}

/*
Sample JSON for testing in body endpoint:

{
  "pePassKey": "",
  "peIdSystem": 1,
  "peIdLoja": 1,
  "peIdDepartamento": 0,
  "peIdUsuario": 0,
  "PE_NOME": "FORNECEDOR PADRAO API",
  "PE_FISIJURI": "J",
  "PE_CNPJ": "00000000000100",
  "PE_RAZAO_SOCIAL": "FORNECEDOR PADRAO API LTDA",
  "PE_DATA_CNPJ": "2020-01-31",
  "PE_EMAIL1": "fornecedor@example.com",
  "PE_UF": "SP",
  "PE_COD_MUNICIPIO": 0,
  "PE_COD_UF": 0
}

*/
