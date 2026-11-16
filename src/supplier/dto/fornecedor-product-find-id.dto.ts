import { IsNumber, IsOptional, IsString } from 'class-validator';

import { FornecedorPanelDto } from './fornecedor-panel.dto.js';

/**
 * Request of `fornecedor-product-find-id`, ported from
 * `UpdateCodigoProdutosFornecedor` (`UsvmFornecedor.pas`).
 */
export class FornecedorProductFindIdDto extends FornecedorPanelDto {
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
  "pePassKey": "",
  "peIdSystem": 1,
  "peIdLoja": 1,
  "peIdDepartamento": 0,
  "peIdUsuario": 0,
  "PE_ID_PRODUTO": 10,
  "PE_ID_FORNECEDOR": 1,
  "PE_PRODUTO_DESCRICAO": "produto",
  "PE_COD_PRODUTO_FORN": "COD-001"
}

*/
