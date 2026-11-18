import type { MarcaFindAllDto } from '../dto/marca-find-all.dto.js';
import { normalizeMarcaText } from './marca-text.util.js';

export function MarcaFindAllQuery(dto: MarcaFindAllDto) {
  const queryParams: (string | number)[] = [dto.PE_ID_SYSTEM];
  let queryString = `
    SELECT 0 AS PS_REGISTROS_COUNT,
      ID_MARCA AS PS_ID_MARCA, ID_MARCA AS PS_ID_PESSOA,
      0 AS PS_ID_IMAGEM, COALESCE(NOME, '') AS PS_NOME,
      COALESCE(NOME, '') AS PS_MARCA,
      COALESCE(PATH_IMAGEM, '') AS PS_PATH_IMAGEM,
      COALESCE(INATIVO, 0) AS PS_INATIVO,
      COALESCE(CAST(DATADOCADASTRO AS CHAR), '') AS PS_DATADOCADASTRO,
      tbl_produto_marca.ANOTACOES  AS PS_ANOTACOES
    FROM tbl_produto_marca
    WHERE ID_SYSTEM_CLIENTE = ? AND INATIVO = 0
  `;
  if (dto.PE_ID_MARCA > 0) {
    queryString += ' AND ID_MARCA = ?';
    queryParams.push(dto.PE_ID_MARCA);
  }
  const name = normalizeMarcaText(dto.PE_MARCA);
  if (name.length > 0) {
    queryString += ' AND LOWER(NOME) LIKE LOWER(?)';
    queryParams.push(name);
  }
  queryString += ' ORDER BY NOME';
  return { queryString, queryParams };
}
