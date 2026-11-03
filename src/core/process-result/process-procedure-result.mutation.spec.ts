import { describe, expect, it } from 'vitest';
import {
  InvalidProcedureFeedbackError,
  processProcedureResultMutation,
} from './process-procedure-result.mutation.js';

describe('processProcedureResultMutation', () => {
  it('preserves numeric identifiers and extra feedback fields', () => {
    const row = {
      sp_return_id: 42,
      sp_message: 'Created',
      sp_error_id: 0,
      extra: 'value',
    };
    expect(
      processProcedureResultMutation([[row], {}], 'Not found'),
    ).toMatchObject({
      recordId: 42,
      message: 'Created',
      errorId: 0,
      quantity: 1,
      data: [row],
    });
  });

  it('preserves procedure errors and string identifiers', () => {
    expect(
      processProcedureResultMutation(
        [[{ sp_return_id: '12', sp_message: 'Failed', sp_error_id: 7 }]],
        'Not found',
      ),
    ).toMatchObject({
      recordId: '12',
      message: 'Failed',
      errorId: 7,
      quantity: 1,
    });
  });

  it('preserves the existing empty and optional feedback behavior', () => {
    expect(processProcedureResultMutation([[]], 'Not found')).toMatchObject({
      recordId: '',
      message: 'Not found',
      errorId: 0,
      quantity: 0,
      data: [],
    });
    expect(
      processProcedureResultMutation(
        [[{ sp_return_id: null, sp_message: null, sp_error_id: null }]],
        'Not found',
      ),
    ).toMatchObject({
      recordId: '',
      errorId: 0,
      quantity: 1,
    });
  });

  it.each([
    null,
    [],
    [{}],
    [[null]],
    [[[]]],
    [[{ sp_return_id: {} }]],
    [[{ sp_message: 1 }]],
    [[{ sp_error_id: '0' }]],
    [[{ sp_error_id: 0.5 }]],
  ])('rejects malformed feedback: %j', (result) => {
    expect(() => processProcedureResultMutation(result, 'Not found')).toThrow(
      InvalidProcedureFeedbackError,
    );
  });
});
