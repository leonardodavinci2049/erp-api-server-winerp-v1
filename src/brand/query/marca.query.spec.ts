import { describe, expect, it } from 'vitest';
import { MarcaFindAllQuery } from './marca-find-all.query.js';
import { MarcaAddComboBoxQuery } from './marca-add-combo-box.query.js';
import { MarcaCreateQuery } from './marca-create.query.js';
import { MarcaUpdateQuery } from './marca-update.query.js';
import { MarcaDeleteQuery } from './marca-delete.query.js';

const context = {
  PE_ID_SYSTEM: 7,
  PE_ID_LOJA: 2,
  PE_ID_DEPARTAMENTO: 0,
  PE_ID_USUARIO: 1,
};

describe('Marca legacy queries', () => {
  it('binds optional filters without changing LIKE patterns or interpolating SQL', () => {
    const payload = "%test' OR 1=1 --%";
    const result = MarcaFindAllQuery({
      ...context,
      PE_ID_MARCA: 8,
      PE_MARCA: payload,
    });
    expect(result.queryParams).toEqual([7, 8, payload]);
    expect(result.queryString).not.toContain(payload);
    expect(result.queryString).toContain('LOWER(NOME) LIKE LOWER(?)');
    expect(result.queryString.match(/\?/g)).toHaveLength(3);
    expect(result.queryString).toContain('ID_MARCA AS PS_ID_PESSOA');
    expect(result.queryString).toContain(
      "COALESCE(tbl_produto_marca.ANOTACOES, '') AS PS_ANOTACOES",
    );
    expect(result.queryString).toContain('AS PS_DATADOCADASTRO');
    const empty = MarcaFindAllQuery({
      ...context,
      PE_ID_MARCA: 0,
      PE_MARCA: 'null',
    });
    expect(empty.queryParams).toEqual([7]);
    expect(empty.queryString).not.toContain('LIKE');
  });

  it('ignores the combo id while keeping tenant and active filters', () => {
    const result = MarcaAddComboBoxQuery({ ...context, PE_ID_MARCA: 99 });
    expect(result.queryParams).toEqual([7]);
    expect(result.queryString).toContain(
      'ID_SYSTEM_CLIENTE = ? AND INATIVO = 0',
    );
    expect(result.queryString).toContain('0 AS ID_PESSOA');
    expect(result.queryString).toContain("'' AS PATH_IMAGEM02");
  });

  it('creates with a shared normalized name, UUID v4, and slug', () => {
    const result = MarcaCreateQuery({
      ...context,
      PE_NOME: 'Marca NULLBásica',
      PE_PASTA_IMG: '/img',
      PE_ANOTACOES: 'NULL',
    });
    expect(result.queryParams).toEqual([
      7,
      'Marca Básica',
      'Marca Básica',
      '/img',
      '',
      expect.stringMatching(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
      ),
      'marca-basica',
    ]);
    expect(result.queryString).toContain('ID_SYSTEM_CLIENTE, NOME, MARCA,');
    expect(result.queryString).toContain('DATADOCADASTRO, UUID, SLUG');
    expect(result.queryString.match(/\?/g)).toHaveLength(7);
    expect(result.queryString).not.toContain('ID_MARCA');
    expect(result.queryString).toContain('CURRENT_TIMESTAMP');
  });

  it('updates NOME and MARCA with the same normalized value and scopes mutations by tenant and id', () => {
    const update = MarcaUpdateQuery({
      ...context,
      PE_ID_MARCA: 42,
      PE_NOME: 'NewNULL',
      PE_PATH_IMAGEM: '/new',
      PE_INATIVO: 1,
      PE_ANOTACOES: 'Note',
    });
    expect(update.queryParams).toEqual([
      'New',
      'New',
      '/new',
      'Note',
      1,
      7,
      42,
    ]);
    expect(update.queryString).toContain('SET NOME = ?, MARCA = ?,');
    expect(update.queryString.match(/\?/g)).toHaveLength(7);
    const deletion = MarcaDeleteQuery({ ...context, PE_ID_MARCA: 42 });
    expect(deletion.queryParams).toEqual([7, 42]);
    for (const result of [update, deletion]) {
      expect(result.queryString).toContain(
        'WHERE ID_SYSTEM_CLIENTE = ? AND ID_MARCA = ?',
      );
    }
  });
});
