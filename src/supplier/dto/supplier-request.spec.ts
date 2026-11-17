import 'reflect-metadata';
import { validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';
import { FornecedorCreateDto } from './fornecedor-create.dto.js';
import { FornecedorDeleteDto } from './fornecedor-delete.dto.js';
import { FornecedorFindAllDto } from './fornecedor-find-all.dto.js';
import { FornecedorProductFindIdDto } from './fornecedor-product-find-id.dto.js';
import { FornecedorUpdateDto } from './fornecedor-update.dto.js';

const context = {
  PE_ID_SYSTEM: 7,
  PE_ID_LOJA: 3,
  PE_ID_DEPARTAMENTO: 0,
  PE_ID_USUARIO: 1,
};
const cases = [
  [FornecedorCreateDto, { PE_NOME: 'Supplier', PE_EMAIL1: 'test@example.com' }],
  [FornecedorUpdateDto, { PE_ID_FORNECEDOR: 42, PE_CNPJ: null }],
  [FornecedorDeleteDto, { PE_ID_FORNECEDOR: 42 }],
  [FornecedorFindAllDto, { PE_FORNECEDOR: 'Supplier' }],
  [FornecedorProductFindIdDto, { PE_ID_PRODUTO: 10 }],
] as const;
const options = { whitelist: true, forbidNonWhitelisted: true };

describe('supplier request validation', () => {
  for (const [Dto, fields] of cases) {
    it(`${Dto.name} validates inherited context and operation fields`, () => {
      const dto = Object.assign(new Dto(), context, fields);
      expect(dto).toBeInstanceOf(BaseRequestDto);
      expect(validateSync(dto, options)).toEqual([]);
      expect(
        validateSync(Object.assign(new Dto(), fields), options).map(
          (error) => error.property,
        ),
      ).toEqual(expect.arrayContaining(Object.keys(context)));
      expect(
        validateSync(
          Object.assign(new Dto(), context, fields, { PE_ID_USUARIO: 'invalid' }),
          options,
        ).map((error) => error.property),
      ).toContain('PE_ID_USUARIO');
      expect(
        validateSync(
          Object.assign(new Dto(), context, fields, { peIdSystem: 9 }),
          options,
        ).map((error) => error.property),
      ).toContain('peIdSystem');
    });
  }

  it('preserves the legacy tenant minimum and create name validation', () => {
    const dto = Object.assign(new FornecedorCreateDto(), context, {
      PE_ID_SYSTEM: 0,
      PE_NOME: 'abc',
    });
    expect(validateSync(dto, options).map((error) => error.property)).toEqual(
      expect.arrayContaining(['PE_ID_SYSTEM', 'PE_NOME']),
    );
  });

  it('rejects the legacy passkey body field, which is header-only', () => {
    const dto = Object.assign(new FornecedorDeleteDto(), context, {
      PE_PASSKEY: 'test-passkey',
      PE_ID_FORNECEDOR: 42,
    });
    expect(validateSync(dto, options).map((error) => error.property)).toEqual([
      'PE_PASSKEY',
    ]);
  });
});
