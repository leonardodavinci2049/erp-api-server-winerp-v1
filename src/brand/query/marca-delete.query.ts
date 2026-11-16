import type { MarcaDeleteDto } from '../dto/marca-delete.dto.js';

export function MarcaDeleteQuery(dto: MarcaDeleteDto) {
  return {
    queryString: `
      DELETE FROM tbl_produto_marca
      WHERE ID_SYSTEM_CLIENTE = ? AND ID_MARCA = ?
    `,
    queryParams: [dto.PE_ID_SYSTEM, dto.PE_ID_MARCA],
  };
}
