import { resultQueryData } from './procedure.result.js';
import type { ResultModel } from './result.model.js';

interface SpDefaultFeedback {
  sp_return_id?: string;
  sp_message?: string;
  sp_error_id?: number;
}

export function processProcedureResultQuery<T extends { id: string }>(
  resultData: unknown[] | [unknown[], unknown[]],
  notFoundMessage: string,
): ResultModel {
  const firstResultSet = resultData[0] as unknown[];
  const secondResultSet = resultData[1] as unknown[];

  // Verifica se o primeiro array é na verdade o feedback (isso acontece quando não há registros e a procedure "pula" o SELECT)
  const isFirstResultFeedback =
    firstResultSet.length > 0 &&
    typeof firstResultSet[0] === 'object' &&
    firstResultSet[0] !== null &&
    'sp_error_id' in firstResultSet[0];

  let tblRecords: T[];
  let DefaultFeedback: SpDefaultFeedback[];

  if (isFirstResultFeedback) {
    tblRecords = [];
    DefaultFeedback = firstResultSet as SpDefaultFeedback[];
  } else {
    tblRecords = firstResultSet as T[];
    DefaultFeedback = (secondResultSet as SpDefaultFeedback[]) || [];
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
  resultData: unknown[] | [unknown[], unknown[]],
  notFoundMessage: string,
): ResultModel {
  const firstResultSet = resultData[0] as unknown[];
  const secondResultSet = resultData[1] as unknown[];

  const isFirstResultFeedback =
    firstResultSet.length > 0 &&
    typeof firstResultSet[0] === 'object' &&
    firstResultSet[0] !== null &&
    'sp_error_id' in firstResultSet[0];

  let tblRecords: T[];
  let DefaultFeedback: SpDefaultFeedback[];

  if (isFirstResultFeedback) {
    tblRecords = [];
    DefaultFeedback = firstResultSet as SpDefaultFeedback[];
  } else {
    tblRecords = firstResultSet as T[];
    DefaultFeedback = (secondResultSet as SpDefaultFeedback[]) || [];
  }

  const qtRecords: number = tblRecords.length;

  const errorId: number = DefaultFeedback[0]?.sp_error_id ?? 0;
  const recordId: string = DefaultFeedback[0]?.sp_return_id || '0';
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
  resultData: unknown[],
  resultSetNames: string[],
  notFoundMessage: string,
): ResultModel {
  const data: Record<string, unknown[]> = {};
  let totalRecords = 0;
  let DefaultFeedback: SpDefaultFeedback[];

  // Verifica se o primeiro array é na verdade o feedback
  // (isso acontece quando não há registros e a procedure "pula" os SELECTs)
  const firstResultSet = resultData[0] as unknown[];
  const isFirstResultFeedback =
    firstResultSet.length > 0 &&
    typeof firstResultSet[0] === 'object' &&
    firstResultSet[0] !== null &&
    'sp_error_id' in firstResultSet[0];

  if (isFirstResultFeedback) {
    for (const name of resultSetNames) {
      data[name] = [];
    }
    DefaultFeedback = firstResultSet as SpDefaultFeedback[];
  } else {
    for (let i = 0; i < resultSetNames.length; i++) {
      const resultSet = (resultData[i] as unknown[]) || [];
      data[resultSetNames[i]] = resultSet;
      totalRecords += resultSet.length;
    }
    const feedbackIndex = resultSetNames.length;
    DefaultFeedback = (resultData[feedbackIndex] as SpDefaultFeedback[]) || [];
  }

  const errorId: number = DefaultFeedback[0]?.sp_error_id ?? 0;
  const recordId: string = DefaultFeedback[0]?.sp_return_id || '0';
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
