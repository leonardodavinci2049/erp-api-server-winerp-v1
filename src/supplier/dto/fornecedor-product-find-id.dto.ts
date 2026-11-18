import { IsNumber, IsDefined, IsString, Min } from 'class-validator';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';

/**
 * Request of `fornecedor-product-find-id`, ported from
 * `UpdateCodigoProdutosFornecedor` (`UsvmFornecedor.pas`).
 */
export class FornecedorProductFindIdDto extends BaseRequestDto {
  @Min(1, { message: 'PE_ID_SYSTEM deve ser maior ou igual a 1.' })
  declare PE_ID_SYSTEM: number;

  @IsNumber()
  @IsDefined()
  PE_ID_PRODUTO!: number;

  @IsNumber()
  @IsDefined()
  PE_ID_FORNECEDOR!: number;

  @IsString()
  @IsDefined()
  PE_PRODUTO_DESCRICAO!: string;

  @IsString()
  @IsDefined()
  PE_COD_PRODUTO_FORN!: string;
}

/*
Sample JSON for testing in body endpoint:

{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": 1,
  "PE_ID_PRODUTO": 10,
  "PE_ID_FORNECEDOR": 1,
  "PE_PRODUTO_DESCRICAO": "produto",
  "PE_COD_PRODUTO_FORN": "COD-001"
}

*/
