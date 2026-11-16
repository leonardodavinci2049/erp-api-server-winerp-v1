import type { MarcaAddComboBoxDto } from '../dto/marca-add-combo-box.dto.js';

export function MarcaAddComboBoxQuery(dto: MarcaAddComboBoxDto) {
  return {
    queryString: `
      SELECT ID_MARCA AS ID_MARCA, 0 AS ID_PESSOA,
        COALESCE(NOME, '') AS NOME, 0 AS ID_IMAGEM,
        COALESCE(PATH_IMAGEM, '') AS PATH_IMAGEM,
        '' AS PATH_IMAGEM01, '' AS PATH_IMAGEM02
      FROM tbl_produto_marca
      WHERE ID_SYSTEM_CLIENTE = ? AND INATIVO = 0
      ORDER BY NOME ASC
    `,
    queryParams: [dto.PE_ID_SYSTEM],
  };
}
