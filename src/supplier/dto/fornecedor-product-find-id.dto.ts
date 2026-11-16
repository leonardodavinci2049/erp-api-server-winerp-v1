import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

/**
 * Request of `fornecedor-product-find-id`, ported from
 * `UpdateCodigoProdutosFornecedor` (`UsvmFornecedor.pas`).
 */
export class FornecedorProductFindIdDto extends BaseRequestDto {
  @Min(1, { message: 'PE_ID_SYSTEM deve ser maior ou igual a 1.' })
  declare PE_ID_SYSTEM: number;

  @IsNumber()
  @IsOptional()
  PE_ID_PRODUTO?: number | null;

  @IsNumber()
  @IsOptional()
  PE_ID_FORNECEDOR?: number | null;

  @IsString()
  @IsOptional()
  PE_PRODUTO_DESCRICAO?: string | null;

  @IsString()
  @IsOptional()
  PE_COD_PRODUTO_FORN?: string | null;
}

/*
Sample JSON for testing in body endpoint:

{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "USER001",
  "PE_ID_PRODUTO": 10,
  "PE_ID_FORNECEDOR": 1,
  "PE_PRODUTO_DESCRICAO": "produto",
  "PE_COD_PRODUTO_FORN": "COD-001"
}

*/
