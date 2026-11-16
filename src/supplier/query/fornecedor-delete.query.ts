import type { FornecedorDeleteDto } from '../dto/fornecedor-delete.dto.js';

interface FornecedorDeleteQueryResult {
  queryString: string;
  queryParams: [number, number];
}

/**
 * Ported from `cancelFornecedorV1` (`UsvmFornecedor.pas`).
 *
 * The DataSnap method receives the id as a separate parameter; here it arrives
 * in the JSON body. The tenant filter still uses only `ID_SYSTEM_CLIENTE`, as
 * in the original statement.
 */
export function FornecedorDeleteQuery(
  dataJsonDto: FornecedorDeleteDto,
): FornecedorDeleteQueryResult {
  const queryString = `
    DELETE FROM tbl_fornecedor
    WHERE
      ID_SYSTEM_CLIENTE = ?
      AND ID_FORNECEDOR = ?
  `;

  const queryParams: FornecedorDeleteQueryResult['queryParams'] = [
    dataJsonDto.PE_ID_SYSTEM,
    dataJsonDto.PE_ID_FORNECEDOR,
  ];

  return { queryString, queryParams };
}
