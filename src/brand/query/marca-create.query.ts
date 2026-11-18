import type { MarcaCreateDto } from '../dto/marca-create.dto.js';
import { normalizeMarcaText } from './marca-text.util.js';

export function MarcaCreateQuery(dto: MarcaCreateDto) {
  const name = normalizeMarcaText(dto.PE_NOME);

  return {
    queryString: `
      INSERT INTO tbl_produto_marca
        (ID_SYSTEM_CLIENTE, NOME, MARCA, PATH_IMAGEM, INATIVO, ANOTACOES, DATADOCADASTRO)
      VALUES (?, ?, ?, ?, 0, ?, CURRENT_TIMESTAMP)
    `,
    queryParams: [
      dto.PE_ID_SYSTEM,
      name,
      name,
      normalizeMarcaText(dto.PE_PASTA_IMG),
      normalizeMarcaText(dto.PE_ANOTACOES),
    ],
  };
}
