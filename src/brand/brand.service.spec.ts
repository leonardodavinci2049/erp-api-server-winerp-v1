import { Test } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DbOperationService } from '../db-operation/db-operation.service.js';
import { BrandService } from './brand.service.js';

vi.mock('../core/utils/functions/log_service_error.js', () => ({
  logServiceError: vi.fn(),
}));

const context = {
  PE_PASSKEY: 'example-passkey',
  PE_ID_SYSTEM: 7,
  PE_ID_LOJA: 1,
  PE_ID_DEPARTAMENTO: 0,
  PE_ID_USUARIO: 'USER001',
};
const mutation = {
  ...context,
  PE_ID_MARCA: 42,
  PE_NOME: 'Marca',
  PE_PASTA_IMG: '',
  PE_PATH_IMAGEM: '',
  PE_INATIVO: 0,
  PE_ANOTACOES: '',
};

describe('Brand legacy service', () => {
  let service: BrandService;
  const db = { selectQuery: vi.fn(), mutationQuery: vi.fn() };
  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [BrandService, { provide: DbOperationService, useValue: db }],
    }).compile();
    service = module.get(BrandService);
  });

  it('preserves row keys in ResultModel and handles empty lists', async () => {
    const row = { PS_ID_MARCA: 42, PS_ID_PESSOA: 42, PS_NOME: 'Marca' };
    db.selectQuery.mockResolvedValueOnce([row]).mockResolvedValueOnce([]);
    const result = await service.taskBrandMarcaFindAllV2({
      ...context,
      PE_ID_MARCA: 0,
      PE_MARCA: '',
    });
    expect(result.data).toEqual({ 'Marca FindAll': [row] });
    expect(result.quantity).toBe(1);
    const empty = await service.taskBrandMarcaAddComboBoxV2(mutation);
    expect(empty.quantity).toBe(0);
  });

  it('returns insertId for creation and the requested id for update and delete', async () => {
    db.mutationQuery.mockResolvedValue({ affectedRows: 1, insertId: 123 });
    expect((await service.taskBrandMarcaCreateV2(mutation)).recordId).toBe(
      '123',
    );
    expect((await service.taskBrandMarcaUpdateV2(mutation)).recordId).toBe(
      '42',
    );
    expect((await service.taskBrandMarcaDeleteV2(mutation)).recordId).toBe(
      '42',
    );
  });

  it('returns the legacy no-rows code and hides driver errors', async () => {
    db.mutationQuery
      .mockResolvedValueOnce({ affectedRows: 0, insertId: 0 })
      .mockRejectedValueOnce(new Error('sensitive SQL and credentials'));
    expect((await service.taskBrandMarcaUpdateV2(mutation)).errorId).toBe(206);
    expect(
      JSON.stringify(await service.taskBrandMarcaDeleteV2(mutation)),
    ).not.toContain('sensitive');
  });
});
