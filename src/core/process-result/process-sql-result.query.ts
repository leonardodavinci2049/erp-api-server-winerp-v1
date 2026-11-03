import { MESSAGES } from '../utils/constants/globalConstants.js';
import { resultQueryData } from './procedure.result.js';
import type { ResultModel } from './result.model.js';

/**
 * Converte as linhas de um SELECT direto para o mesmo envelope utilizado
 * por processProcedureResultMultiQuery em consultas com um result set.
 */
export function processSqlResultQuery<T>(
  resultData: T[],
  resultSetName: string,
  notFoundMessage: string,
  successMessage: string = MESSAGES.PROCESSING_SUCCESS,
): ResultModel {
  const totalRecords = resultData.length;
  const feedback = totalRecords === 0 ? notFoundMessage : successMessage;
  const recordId = totalRecords === 0 ? '0' : '1';
  const data: Record<string, T[]> = {
    [resultSetName]: resultData,
  };

  return resultQueryData<Record<string, T[]>>(
    0,
    recordId,
    0,
    feedback,
    data,
    totalRecords,
    '',
  );
}
