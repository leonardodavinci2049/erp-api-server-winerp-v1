import { resultQueryData } from './procedure.result.js';
import type { ResultModel } from './result.model.js';

interface SpDefaultFeedback {
  sp_return_id?: string | number | null;
  sp_message?: string | null;
  sp_error_id?: number | null;
}

export class InvalidProcedureQueryResultError extends Error {
  constructor() {
    super('Procedure returned an invalid query result.');
    this.name = 'InvalidProcedureQueryResultError';
  }
}

function getResultSets(resultData: unknown): unknown[] {
  if (!Array.isArray(resultData) || !Array.isArray(resultData[0])) {
    throw new InvalidProcedureQueryResultError();
  }
  return resultData;
}

function getResultSet(value: unknown): unknown[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new InvalidProcedureQueryResultError();
  return value;
}

function isFeedbackResultSet(resultSet: unknown[]): boolean {
  const first = resultSet[0];
  return (
    typeof first === 'object' &&
    first !== null &&
    !Array.isArray(first) &&
    'sp_error_id' in first
  );
}

function getFeedback(value: unknown): SpDefaultFeedback[] {
  return getResultSet(value).map((item: unknown) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new InvalidProcedureQueryResultError();
    }
    const row = item as Record<string, unknown>;
    if (
      (row.sp_return_id != null &&
        typeof row.sp_return_id !== 'string' &&
        typeof row.sp_return_id !== 'number') ||
      (row.sp_message != null && typeof row.sp_message !== 'string') ||
      (row.sp_error_id != null &&
        (typeof row.sp_error_id !== 'number' ||
          !Number.isInteger(row.sp_error_id)))
    ) {
      throw new InvalidProcedureQueryResultError();
    }
    return row as SpDefaultFeedback;
  });
}

export function processProcedureResultQuery<T extends { id: string }>(
  resultData: unknown,
  notFoundMessage: string,
): ResultModel {
  const resultSets = getResultSets(resultData);
  const firstResultSet = getResultSet(resultSets[0]);

  // Verifica se o primeiro array é na verdade o feedback (isso acontece quando não há registros e a procedure "pula" o SELECT)
  const isFirstResultFeedback = isFeedbackResultSet(firstResultSet);

  let tblRecords: T[];
  let DefaultFeedback: SpDefaultFeedback[];

  if (isFirstResultFeedback) {
    tblRecords = [];
    DefaultFeedback = getFeedback(firstResultSet);
  } else {
    tblRecords = firstResultSet as T[];
    DefaultFeedback = getFeedback(resultSets[1]);
  }

  const qtRecords: number = tblRecords.length;
  const tblRecord = tblRecords[0] || null;
  const recordId: string = tblRecord?.id ?? '';

  const errorId: number = DefaultFeedback[0]?.sp_error_id ?? 0;
  let Feedback = DefaultFeedback[0]?.sp_message || '';

  if (qtRecords === 0 && errorId === 0) {
    Feedback = notFoundMessage;
  }

  return resultQueryData<T[]>(
    0,
    recordId,
    errorId,
    Feedback,
    tblRecords,
    qtRecords,
    '',
  );
}

export function processProcedureResultQueryWithoutId<T>(
  resultData: unknown,
  notFoundMessage: string,
): ResultModel {
  const resultSets = getResultSets(resultData);
  const firstResultSet = getResultSet(resultSets[0]);

  const isFirstResultFeedback = isFeedbackResultSet(firstResultSet);

  let tblRecords: T[];
  let DefaultFeedback: SpDefaultFeedback[];

  if (isFirstResultFeedback) {
    tblRecords = [];
    DefaultFeedback = getFeedback(firstResultSet);
  } else {
    tblRecords = firstResultSet as T[];
    DefaultFeedback = getFeedback(resultSets[1]);
  }

  const qtRecords: number = tblRecords.length;

  const errorId: number = DefaultFeedback[0]?.sp_error_id ?? 0;
  // Preserve numeric IDs returned by existing procedures at runtime.
  const recordId = (DefaultFeedback[0]?.sp_return_id || '0') as string;
  let Feedback = DefaultFeedback[0]?.sp_message || '';

  if (qtRecords === 0 && errorId === 0) {
    Feedback = notFoundMessage;
  }

  return resultQueryData<T[]>(
    0,
    recordId,
    errorId,
    Feedback,
    tblRecords,
    qtRecords,
    '',
  );
}

/**
 * Processa resultado de procedure que retorna múltiplos result sets tipados.
 *
 * @param resultData - Array bruto retornado pela procedure
 * @param resultSetNames - Nomes para cada result set de dados (ex: ['orderSummary', 'orderItems', 'customer', 'seller'])
 * @param notFoundMessage - Mensagem quando nenhum registro é encontrado
 *
 * O feedback (SpDefaultFeedback) é esperado logo após os result sets de dados,
 * seguido pelo SpOperationResult.
 *
 * Exemplo de uso:
 * ```
 * processProcedureResultMultiQuery(
 *   resultData as unknown[],
 *   ['orderSummary', 'orderItems', 'customer', 'seller'],
 *   'Order not found',
 * );
 * ```
 */
export function processProcedureResultMultiQuery(
  resultData: unknown,
  resultSetNames: string[],
  notFoundMessage: string,
): ResultModel {
  const data: Record<string, unknown[]> = {};
  let totalRecords = 0;
  let DefaultFeedback: SpDefaultFeedback[];

  // Verifica se o primeiro array é na verdade o feedback
  // (isso acontece quando não há registros e a procedure "pula" os SELECTs)
  const resultSets = getResultSets(resultData);
  const firstResultSet = getResultSet(resultSets[0]);
  const isFirstResultFeedback = isFeedbackResultSet(firstResultSet);

  if (isFirstResultFeedback) {
    for (const name of resultSetNames) {
      data[name] = [];
    }
    DefaultFeedback = getFeedback(firstResultSet);
  } else {
    for (let i = 0; i < resultSetNames.length; i++) {
      const resultSet = getResultSet(resultSets[i]);
      data[resultSetNames[i]] = resultSet;
      totalRecords += resultSet.length;
    }
    const feedbackIndex = resultSetNames.length;
    DefaultFeedback = getFeedback(resultSets[feedbackIndex]);
  }

  const errorId: number = DefaultFeedback[0]?.sp_error_id ?? 0;
  // Preserve numeric IDs returned by existing procedures at runtime.
  const recordId = (DefaultFeedback[0]?.sp_return_id || '0') as string;
  let Feedback = DefaultFeedback[0]?.sp_message || '';

  if (totalRecords === 0 && errorId === 0) {
    Feedback = notFoundMessage;
  }

  return resultQueryData<Record<string, unknown[]>>(
    0,
    recordId,
    errorId,
    Feedback,
    data,
    totalRecords,
    '',
  );
}
