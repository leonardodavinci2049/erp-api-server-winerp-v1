import { IsOptional, IsString } from 'class-validator';

import { FornecedorPanelDto } from './fornecedor-panel.dto.js';

/**
 * Request of `fornecedor-find-all`, ported from `UpdateFornecedor`
 * (`UsvmFornecedor.pas`).
 */
export class FornecedorFindAllDto extends FornecedorPanelDto {
  @IsString()
  @IsOptional()
  PE_FORNECEDOR?: string | null;
}

/*
Sample JSON for testing in body endpoint:

{
  "pePassKey": "",
  "peIdSystem": 1,
  "peIdLoja": 1,
  "peIdDepartamento": 0,
  "peIdUsuario": 0,
  "PE_FORNECEDOR": "FORNEC"
}

*/
