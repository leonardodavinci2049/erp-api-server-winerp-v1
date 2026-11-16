import 'reflect-metadata';
import { validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';

import { BaseRequestDto } from '../../core/dto/base-request.dto.js';
import { SupplierFindManagerIdV2Query } from '../query/supplier-find-manager-id-v2.query.js';
import { SupplierUpdGeneralFieldQuery } from '../query/supplier-upd-general-field.query.js';
import { FornecedorCreateDto } from './fornecedor-create.dto.js';
import { FornecedorDeleteDto } from './fornecedor-delete.dto.js';
import { FornecedorFindAllDto } from './fornecedor-find-all.dto.js';
import { FornecedorProductFindIdDto } from './fornecedor-product-find-id.dto.js';
import { FornecedorUpdateDto } from './fornecedor-update.dto.js';
import { SupplierFindManagerIdV2Dto } from './supplier-find-manager-id-v2.dto.js';
import { SupplierUpdGeneralFieldDto } from './supplier-upd-general-field.dto.js';

const context = {
  PE_PASSKEY: 'test-passkey',
  PE_ID_SYSTEM: 7,
  PE_ID_LOJA: 3,
  PE_ID_DEPARTAMENTO: 0,
  PE_ID_USUARIO: 'user-test',
};
const managerContext = {
  pe_app_id: 1,
  pe_organization_id: 'org-test',
  pe_user_name: 'Test User',
  pe_user_role: 'admin',
};
const cases = [
  [FornecedorCreateDto, { PE_NOME: 'Supplier', PE_EMAIL1: 'test@example.com' }],
  [FornecedorUpdateDto, { PE_ID_FORNECEDOR: 42, PE_CNPJ: null }],
  [FornecedorDeleteDto, { PE_ID_FORNECEDOR: 42 }],
  [FornecedorFindAllDto, { PE_FORNECEDOR: 'Supplier' }],
  [FornecedorProductFindIdDto, { PE_ID_PRODUTO: 10 }],
  [SupplierFindManagerIdV2Dto, { ...managerContext, pe_supplier_id: 42 }],
  [
    SupplierUpdGeneralFieldDto,
    {
      ...managerContext,
      pe_register_id: 42,
      pe_field_type: 1,
      pe_field: 'NOME',
    },
  ],
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
          Object.assign(new Dto(), context, fields, { PE_ID_USUARIO: 1 }),
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

  it('preserves manager tenant and store parameter order', () => {
    const dto = Object.assign(
      new SupplierFindManagerIdV2Dto(),
      context,
      managerContext,
      { pe_supplier_id: 42 },
    );
    expect(SupplierFindManagerIdV2Query(dto).queryParams).toEqual([7, 3, 42]);
  });

  it('maps base context to the existing procedure signature', () => {
    const dto = Object.assign(
      new SupplierUpdGeneralFieldDto(),
      context,
      managerContext,
      {
        pe_register_id: 42,
        pe_field_type: 1,
        pe_field: 'NOME',
        pe_value_str: 'Supplier',
      },
    );
    expect(SupplierUpdGeneralFieldQuery(dto).queryParams).toEqual([
      1,
      7,
      3,
      'org-test',
      'user-test',
      'Test User',
      'admin',
      null,
      42,
      1,
      'NOME',
      'Supplier',
      null,
      null,
      null,
    ]);
  });
});
