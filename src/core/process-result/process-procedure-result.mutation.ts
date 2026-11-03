import { resultQueryData } from './procedure.result.js';
import type { ResultModel } from './result.model.js';

interface SpDefaultFeedback {
  sp_return_id?: string | number | null;
  sp_message?: string | null;
  sp_error_id?: number | null;
  [key: string]: unknown;
}

export class InvalidProcedureFeedbackError extends Error {
  constructor() {
    super('Procedure returned invalid feedback.');
    this.name = 'InvalidProcedureFeedbackError';
  }
}

export function processProcedureResultMutation(
  resultData: unknown,
  notFoundMessage: string,
): ResultModel {
  if (!Array.isArray(resultData) || !Array.isArray(resultData[0])) {
    throw new InvalidProcedureFeedbackError();
  }

  const feedback: SpDefaultFeedback[] = resultData[0].map((value: unknown) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new InvalidProcedureFeedbackError();
    }
    const row = value as Record<string, unknown>;
    if (
      (row.sp_return_id != null &&
        typeof row.sp_return_id !== 'string' &&
        typeof row.sp_return_id !== 'number') ||
      (row.sp_message != null && typeof row.sp_message !== 'string') ||
      (row.sp_error_id != null &&
        (typeof row.sp_error_id !== 'number' ||
          !Number.isInteger(row.sp_error_id)))
    ) {
      throw new InvalidProcedureFeedbackError();
    }
    return row as SpDefaultFeedback;
  });

  const first = feedback[0];
  const errorId = first?.sp_error_id ?? 0;
  // Preserve numeric IDs returned by existing procedures at runtime.
  const recordId = (first?.sp_return_id ?? '') as string;
  const message =
    feedback.length === 0 ? notFoundMessage : first?.sp_message || '';

  return resultQueryData(
    0,
    recordId,
    errorId,
    message,
    feedback,
    feedback.length,
    '',
  );
}
