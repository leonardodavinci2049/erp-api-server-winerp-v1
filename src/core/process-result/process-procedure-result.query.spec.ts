import { describe, expect, it } from 'vitest';
import {
  InvalidProcedureQueryResultError,
  processProcedureResultMultiQuery,
  processProcedureResultQuery,
  processProcedureResultQueryWithoutId,
} from './process-procedure-result.query.js';

describe('procedure query result processing', () => {
  it('uses the first record ID and preserves the records', () => {
    const records = [{ id: '42', name: 'Brand' }];
    expect(
      processProcedureResultQuery(
        [records, [{ sp_error_id: 0, sp_message: 'Loaded' }], {}],
        'Not found',
      ),
    ).toMatchObject({
      recordId: '42',
      message: 'Loaded',
      errorId: 0,
      quantity: 1,
      data: records,
    });
  });

  it('preserves numeric feedback IDs and defaults when no ID is returned', () => {
    expect(
      processProcedureResultQueryWithoutId(
        [[{ name: 'Brand' }], [{ sp_return_id: 42, sp_error_id: 0 }]],
        'Not found',
      ),
    ).toMatchObject({
      recordId: 42,
      quantity: 1,
    });
    expect(
      processProcedureResultQueryWithoutId([[]], 'Not found'),
    ).toMatchObject({
      recordId: '0',
      message: 'Not found',
      errorId: 0,
      quantity: 0,
      data: [],
    });
  });

  it('maps multiple data sets and counts their records', () => {
    expect(
      processProcedureResultMultiQuery(
        [
          [{ id: 1 }],
          [{ id: 2 }, { id: 3 }],
          [{ sp_return_id: 9, sp_error_id: 0, sp_message: 'Loaded' }],
          {},
        ],
        ['brands', 'items'],
        'Not found',
      ),
    ).toMatchObject({
      recordId: 9,
      message: 'Loaded',
      quantity: 3,
      data: { brands: [{ id: 1 }], items: [{ id: 2 }, { id: 3 }] },
    });
  });

  it('handles feedback as the first result set for all variants', () => {
    const input = [
      [{ sp_error_id: 5, sp_message: 'Failed', sp_return_id: 7 }],
      {},
    ];
    expect(processProcedureResultQuery(input, 'Not found')).toMatchObject({
      recordId: '',
      message: 'Failed',
      errorId: 5,
      quantity: 0,
      data: [],
    });
    expect(
      processProcedureResultQueryWithoutId(input, 'Not found'),
    ).toMatchObject({
      recordId: 7,
      message: 'Failed',
      errorId: 5,
      quantity: 0,
      data: [],
    });
    expect(
      processProcedureResultMultiQuery(input, ['brands', 'items'], 'Not found'),
    ).toMatchObject({
      recordId: 7,
      message: 'Failed',
      errorId: 5,
      quantity: 0,
      data: { brands: [], items: [] },
    });
  });

  it('preserves absent optional result sets and feedback', () => {
    expect(
      processProcedureResultMultiQuery([[]], ['brands', 'items'], 'Not found'),
    ).toMatchObject({
      message: 'Not found',
      recordId: '0',
      quantity: 0,
      data: { brands: [], items: [] },
    });
  });

  it.each([
    null,
    [],
    [{}],
    [[], {}],
    [[], [null]],
    [[], [{ sp_error_id: '0' }]],
    [[], [{ sp_error_id: 0.5 }]],
    [[], [{ sp_message: 1 }]],
    [[], [{ sp_return_id: {} }]],
  ])('rejects invalid query feedback or structure: %j', (input) => {
    expect(() => processProcedureResultQuery(input, 'Not found')).toThrow(
      InvalidProcedureQueryResultError,
    );
    expect(() =>
      processProcedureResultQueryWithoutId(input, 'Not found'),
    ).toThrow(InvalidProcedureQueryResultError);
    expect(() =>
      processProcedureResultMultiQuery(input, ['brands'], 'Not found'),
    ).toThrow(InvalidProcedureQueryResultError);
  });

  it('rejects an invalid additional data set', () => {
    expect(() =>
      processProcedureResultMultiQuery(
        [[], {}],
        ['brands', 'items'],
        'Not found',
      ),
    ).toThrow(InvalidProcedureQueryResultError);
  });
});
