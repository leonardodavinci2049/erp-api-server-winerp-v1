import { resultQueryData } from './procedure.result.js';
import type { ResultModel } from './result.model.js';

interface SpDefaultFeedback {
  sp_return_id?: string;
  sp_message?: string;
  sp_error_id?: number;
}

export function processProcedureResultMutation(
  resultData: unknown[] | [unknown[], unknown[]],
  notFoundMessage: string,
): ResultModel {
  const DefaultFeedback = resultData[0] as SpDefaultFeedback[];
  const qtRecords = DefaultFeedback.length ?? 0;
  const errorId: number = DefaultFeedback[0]?.sp_error_id ?? 0;
  const recordId: string = DefaultFeedback[0]?.sp_return_id ?? '';

  let Feedback = DefaultFeedback[0]?.sp_message || '';

  if (qtRecords === 0 && errorId === 0) {
    Feedback = notFoundMessage;
  }

  return resultQueryData<SpDefaultFeedback[]>(
    0,
    recordId,
    errorId,
    Feedback,
    DefaultFeedback,
    qtRecords,
    '',
  );
}
