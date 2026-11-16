import { describe, expect, it } from 'vitest';
import { RESPONSE_CODES } from '../utils/constants/globalConstants.js';
import {
  processSqlResultMutation,
  SQL_MUTATION_NO_ROWS_AFFECTED,
} from './process-sql-result.mutation.js';

describe('processSqlResultMutation', () => {
  it('uses the explicit record id when one is provided', () => {
    expect(
      processSqlResultMutation(
        { affectedRows: 1, insertId: 99 },
        'Fornecedor atualizado',
        'Fornecedor não encontrado',
        42,
      ),
    ).toMatchObject({
      statusCode: RESPONSE_CODES.SUCCESS,
      recordId: '42',
      message: 'Fornecedor atualizado',
      errorId: 0,
      quantity: 1,
      data: [],
    });
  });

  it('falls back to insertId and then to affectedRows', () => {
    expect(
      processSqlResultMutation(
        { affectedRows: 1, insertId: 15 },
        'Criado',
        'Não criado',
      ),
    ).toMatchObject({ recordId: '15', quantity: 1 });

    expect(
      processSqlResultMutation(
        { affectedRows: 2, insertId: 0 },
        'Excluído',
        'Não excluído',
      ),
    ).toMatchObject({ recordId: '0', quantity: 2 });
  });

  it('reports the legacy no-rows error when nothing is affected', () => {
    expect(
      processSqlResultMutation(
        { affectedRows: 0, insertId: 0 },
        'Criado',
        'Nenhum fornecedor afetado',
      ),
    ).toMatchObject({
      statusCode: RESPONSE_CODES.PROCESSING_FAILED,
      recordId: '0',
      message: 'Nenhum fornecedor afetado',
      errorId: SQL_MUTATION_NO_ROWS_AFFECTED,
      quantity: 0,
      data: [],
    });
  });

  it('treats a missing affectedRows as no rows affected', () => {
    expect(
      processSqlResultMutation({}, 'Criado', 'Nenhum fornecedor afetado'),
    ).toMatchObject({
      errorId: SQL_MUTATION_NO_ROWS_AFFECTED,
      quantity: 0,
    });
  });
});
