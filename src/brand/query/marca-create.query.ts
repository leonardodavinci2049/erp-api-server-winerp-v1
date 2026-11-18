import { v4 as uuidV4 } from 'uuid';
import { generateSlug } from '../../core/utils/generators/generate-slug.js';
import type { MarcaCreateDto } from '../dto/marca-create.dto.js';
import { normalizeMarcaText } from './marca-text.util.js';

export function MarcaCreateQuery(dto: MarcaCreateDto) {
  const name = normalizeMarcaText(dto.PE_NOME);
  const uuid = uuidV4();
  const slug = generateSlug(name);

  return {
    queryString: `
      INSERT INTO tbl_produto_marca
        (ID_SYSTEM_CLIENTE, NOME, MARCA, PATH_IMAGEM, INATIVO, ANOTACOES,
         DATADOCADASTRO, UUID, SLUG)
      VALUES (?, ?, ?, ?, 0, ?, CURRENT_TIMESTAMP, ?, ?)
    `,
    queryParams: [
      dto.PE_ID_SYSTEM,
      name,
      name,
      normalizeMarcaText(dto.PE_PASTA_IMG),
      normalizeMarcaText(dto.PE_ANOTACOES),
      uuid,
      slug,
    ],
  };
}
