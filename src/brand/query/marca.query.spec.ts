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
    expect(result.queryString).toContain("'' AS PS_ANOTACOES");
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

  it('creates with the same normalized value for NOME and MARCA', () => {
    const result = MarcaCreateQuery({
      ...context,
      PE_NOME: 'Marca NULLteste',
      PE_PASTA_IMG: '/img',
      PE_ANOTACOES: 'NULL',
    });
    expect(result.queryParams).toEqual([
      7,
      'Marca teste',
      'Marca teste',
      '/img',
      '',
    ]);
    expect(result.queryString).toContain('ID_SYSTEM_CLIENTE, NOME, MARCA,');
    expect(result.queryString.match(/\?/g)).toHaveLength(5);
    expect(result.queryString).not.toContain('ID_MARCA');
    expect(result.queryString).toContain('CURRENT_TIMESTAMP');
  });

  it('scopes update and physical deletion by tenant and id', () => {
    const update = MarcaUpdateQuery({
      ...context,
      PE_ID_MARCA: 42,
      PE_NOME: 'New',
      PE_PATH_IMAGEM: '/new',
      PE_INATIVO: 1,
      PE_ANOTACOES: 'Note',
    });
    expect(update.queryParams).toEqual(['New', '/new', 'Note', 1, 7, 42]);
    expect(update.queryString.match(/\?/g)).toHaveLength(6);
    const deletion = MarcaDeleteQuery({ ...context, PE_ID_MARCA: 42 });
    expect(deletion.queryParams).toEqual([7, 42]);
    for (const result of [update, deletion]) {
      expect(result.queryString).toContain(
        'WHERE ID_SYSTEM_CLIENTE = ? AND ID_MARCA = ?',
      );
    }
  });
});
