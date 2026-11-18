import { describe, expect, it } from 'vitest';

import type { FornecedorCreateDto } from '../dto/fornecedor-create.dto.js';
import type { FornecedorDeleteDto } from '../dto/fornecedor-delete.dto.js';
import type { FornecedorFindAllDto } from '../dto/fornecedor-find-all.dto.js';
import type { FornecedorProductFindIdDto } from '../dto/fornecedor-product-find-id.dto.js';
import type { FornecedorUpdateDto } from '../dto/fornecedor-update.dto.js';
import { FornecedorCreateQuery } from './fornecedor-create.query.js';
import { toSqlDate } from './fornecedor-date.util.js';
import { FornecedorDeleteQuery } from './fornecedor-delete.query.js';
import { FornecedorFindAllQuery } from './fornecedor-find-all.query.js';
import { FornecedorProductFindIdQuery } from './fornecedor-product-find-id.query.js';
import { FornecedorUpdateQuery } from './fornecedor-update.query.js';

function countPlaceholders(queryString: string): number {
  return (queryString.match(/\?/g) ?? []).length;
}

describe('fornecedor query builders', () => {
  it('fornecedor-find-all filters by system client and optional name', () => {
    const withoutName = FornecedorFindAllQuery({
      PE_ID_SYSTEM: 1,
    } as FornecedorFindAllDto);

    expect(countPlaceholders(withoutName.queryString)).toBe(
      withoutName.queryParams.length,
    );
    expect(withoutName.queryParams).toEqual([1]);
    expect(withoutName.queryString).toContain(
      'tbl_fornecedor.ID_SYSTEM_CLIENTE = ?',
    );
    expect(withoutName.queryString).not.toContain('NOME LIKE ?');
    expect(withoutName.queryString).toContain('0 AS ID_PESSOA');
    expect(withoutName.queryString).toContain("'' AS MSN");
    expect(withoutName.queryString).toContain(
      'tbl_fornecedor.CARGO_RESPOSNAVEL AS CARGO_RESPOSNAVEL',
    );
    expect(withoutName.queryString).toContain('0 AS FLAG_FABRICANTE');
    expect(withoutName.queryString).toContain("'' AS PATH_IMAGEM01");

    const withShortName = FornecedorFindAllQuery({
      PE_ID_SYSTEM: 1,
      PE_FORNECEDOR: 'AB',
    } as FornecedorFindAllDto);

    expect(withShortName.queryParams).toEqual([1]);

    const withName = FornecedorFindAllQuery({
      PE_ID_SYSTEM: 1,
      PE_FORNECEDOR: 'FORNEC',
    } as FornecedorFindAllDto);

    expect(withName.queryParams).toEqual([1, '%FORNEC%']);
    expect(countPlaceholders(withName.queryString)).toBe(2);
  });

  it('fornecedor-product-find-id applies only the informed filters', () => {
    const withoutFilters = FornecedorProductFindIdQuery(
      {} as FornecedorProductFindIdDto,
    );

    expect(withoutFilters.queryParams).toEqual([]);
    expect(withoutFilters.queryString).toContain('1 = 1');
    expect(withoutFilters.queryString).toContain('AS PS_ID_TBL_PRODUTO_FORN');
    expect(withoutFilters.queryString).toContain('AS PS_PATH_IMAGEM_VENDA');

    const withFilters = FornecedorProductFindIdQuery({
      PE_ID_PRODUTO: 10,
      PE_ID_FORNECEDOR: 2,
      PE_PRODUTO_DESCRICAO: 'produto',
      PE_COD_PRODUTO_FORN: 'COD-001',
    } as FornecedorProductFindIdDto);

    expect(withFilters.queryParams).toEqual([10, 2, 'produto', 'COD-001']);
    expect(countPlaceholders(withFilters.queryString)).toBe(4);
    expect(withFilters.queryString).toContain(
      'LOWER(tbl_produto.produto) LIKE LOWER(?)',
    );
  });

  it('fornecedor-create keeps the legacy insert columns in order', () => {
    const { queryString, queryParams } = FornecedorCreateQuery({
      PE_ID_SYSTEM: 7,
      PE_NOME: 'FORNECEDOR API',
      PE_ID_CATEGORIA: 3,
      PE_ID_TIPO: 2,
      PE_DATA_CNPJ: '31/01/2020',
      PE_ANOTACOES: 'nota',
    } as FornecedorCreateDto);

    expect(countPlaceholders(queryString)).toBe(queryParams.length);
    expect(queryParams).toHaveLength(63);
    expect(queryParams[0]).toBe(7);
    expect(queryParams[1]).toBe(3);
    expect(queryParams[2]).toBe(2);
    expect(queryParams[3]).toBe('FORNECEDOR API');
    expect(queryParams[20]).toBe('2020-01-31');
    expect(queryParams[62]).toBe('nota');
    expect(queryString).not.toContain('ID_FORNECEDOR');
    expect(queryString).toContain('CURRENT_TIMESTAMP, -- DATADOCADASTRO');
  });

  it.each([
    ['10/10/2010', '2010-10-10'],
    ['2010-10-10', '2010-10-10'],
    ['', null],
  ])('fornecedor-update binds birth date %j and filters by tenant', (input, expected) => {
    const { queryString, queryParams } = FornecedorUpdateQuery({
      PE_ID_SYSTEM: 7,
      PE_ID_FORNECEDOR: 42,
      PE_NOME: 'FORNECEDOR API',
      PE_ID_CATEGORIA: 3,
      PE_DATADONASCIMENTO: input,
    } as FornecedorUpdateDto);

    expect(countPlaceholders(queryString)).toBe(queryParams.length);
    expect(queryParams).toHaveLength(64);
    expect(queryParams[0]).toBe(3);
    expect(queryParams[2]).toBe('FORNECEDOR API');
    expect(queryParams[61]).toBeNull();
    expect(queryParams[62]).toBe(7);
    expect(queryParams[63]).toBe(42);
    expect(queryString).toContain('DATADONASCIMENTO = ?');
    const birthDateIndex = countPlaceholders(queryString.split('DATADONASCIMENTO = ?')[0]);
    expect(queryParams[birthDateIndex]).toBe(expected);
    expect(queryString).toContain('ID_SYSTEM_CLIENTE = ?');
    expect(queryString).toContain('ID_FORNECEDOR = ?');
  });

  it('fornecedor-delete filters by system client and supplier id', () => {
    const { queryString, queryParams } = FornecedorDeleteQuery({
      PE_ID_SYSTEM: 7,
      PE_ID_FORNECEDOR: 42,
    } as FornecedorDeleteDto);

    expect(countPlaceholders(queryString)).toBe(2);
    expect(queryParams).toEqual([7, 42]);
    expect(queryString).toContain('DELETE FROM tbl_fornecedor');
  });

  it('toSqlDate normalizes legacy date values', () => {
    expect(toSqlDate('2020-01-31')).toBe('2020-01-31');
    expect(toSqlDate('31/01/2020')).toBe('2020-01-31');
    expect(toSqlDate('')).toBeNull();
    expect(toSqlDate('   ')).toBeNull();
    expect(toSqlDate(null)).toBeNull();
    expect(toSqlDate(undefined)).toBeNull();
  });
});
