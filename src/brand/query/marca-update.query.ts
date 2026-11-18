import type { MarcaUpdateDto } from '../dto/marca-update.dto.js';
import { normalizeMarcaText } from './marca-text.util.js';

export function MarcaUpdateQuery(dto: MarcaUpdateDto) {
    const name = normalizeMarcaText(dto.PE_NOME);
  return {
    queryString: `
      UPDATE tbl_produto_marca
      SET NOME = ?, PATH_IMAGEM = ?, ANOTACOES = ?, INATIVO = ?
      WHERE ID_SYSTEM_CLIENTE = ? AND ID_MARCA = ?
    `,
    queryParams: [
      normalizeMarcaText(dto.PE_NOME),
      normalizeMarcaText(dto.PE_PATH_IMAGEM),
      normalizeMarcaText(dto.PE_ANOTACOES),
      dto.PE_INATIVO,
      dto.PE_ID_SYSTEM,
      dto.PE_ID_MARCA,
    ],
  };
}
