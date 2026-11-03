import { MESSAGES, RESPONSE_CODES } from '../utils/constants/globalConstants.js';
import { ResultModel } from './result.model.js';

export function resultQueryData<T>(
  crudId: number,
  recordId: string,
  errorId: number,
  feedback: string,
  resultData: T,
  quantity: number = 0,
  info1?: string,
): ResultModel {
  const sanitizedData = JSON.parse(JSON.stringify(resultData)) as T;

  if (errorId === 0) {
    if (crudId === 1 && errorId === 0 && quantity === 0) {
      const sucessoMessage =
        feedback && feedback.trim() !== ''
          ? feedback
          : MESSAGES.PROCESSING_SUCCESS;
      return new ResultModel(
        RESPONSE_CODES.SUCCESS,
        sucessoMessage,
        recordId,
        sanitizedData, // Sanitize the data
        quantity,
        errorId,
        info1,
      );
    } else {
      const sucessoMessage =
        feedback && feedback.trim() !== ''
          ? feedback
          : MESSAGES.PROCESSING_SUCCESS;
      return new ResultModel(
        RESPONSE_CODES.SUCCESS,
        sucessoMessage,
        recordId,
        sanitizedData, // Sanitize the data
        quantity,
        errorId,
        info1,
      );
    }
  } else {
    const failedMessage =
      feedback && feedback.trim() !== ''
        ? feedback
        : MESSAGES.PROCESSING_FAILURE;

    return new ResultModel(
      RESPONSE_CODES.PROCESSING_FAILED,
      failedMessage,
      recordId, // Sanitize the data
      sanitizedData,
      quantity,
      errorId,
    );
  }
}
