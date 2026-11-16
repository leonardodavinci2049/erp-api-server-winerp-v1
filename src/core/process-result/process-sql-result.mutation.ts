import { resultQueryData } from './procedure.result.js';
import type { ResultModel } from './result.model.js';

/** `sp_error_id` used by the legacy procedures when no row is affected. */
export const SQL_MUTATION_NO_ROWS_AFFECTED = 206;

export interface SqlMutationResult {
  affectedRows?: number;
  insertId?: number;
}

/**
 * Converts the header of a direct INSERT/UPDATE/DELETE into the same
 * `ResultModel` envelope used by the procedure-based mutations.
 *
 * @param resultData - Header returned by `DbOperationService.mutationQuery`.
 * @param successMessage - Feedback when at least one row is affected.
 * @param notFoundMessage - Feedback when no row is affected.
 * @param recordId - Identifier exposed to the client. Defaults to `insertId`
 * and then to `affectedRows`.
 */
export function processSqlResultMutation(
  resultData: SqlMutationResult,
  successMessage: string,
  notFoundMessage: string,
  recordId?: number | string,
): ResultModel {
  const affectedRows = resultData.affectedRows ?? 0;

  if (affectedRows < 1) {
    return resultQueryData(
      0,
      '0',
      SQL_MUTATION_NO_ROWS_AFFECTED,
      notFoundMessage,
      [],
      0,
      '',
    );
  }

  const olRecordId = recordId ?? resultData.insertId ?? affectedRows;

  return resultQueryData(
    1,
    String(olRecordId),
    0,
    successMessage,
    [],
    affectedRows,
    '',
  );
}
