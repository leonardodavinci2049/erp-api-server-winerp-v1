import { IsNumber } from 'class-validator';

import { FornecedorPanelDto } from './fornecedor-panel.dto.js';

/**
 * Request of `fornecedor-delete`, ported from `cancelFornecedorV1`
 * (`UsvmFornecedor.pas`). The legacy method receives the id as a separate
 * parameter; over HTTP it is sent in the JSON body.
 */
export class FornecedorDeleteDto extends FornecedorPanelDto {
  @IsNumber()
  PE_ID_FORNECEDOR!: number;
}

/*
Sample JSON for testing in body endpoint:

{
  "pePasseKey": "",
  "peIdSystem": 1,
  "peIdLoja": 1,
  "peIdDepartamento": 0,
  "peIdUsuario": 0,
  "PE_ID_FORNECEDOR": 1
}

*/
