import { ResultModel } from '../result.model.js';
import { MESSAGES, RESPONSE_CODES } from '../constants/globalConstants.js';

export function resultQueryData<T>(
  crudId: number,
  recordId: number,
  errorId: number,
  feedback: string,
  resultData: T,
  quantity: number = 0,
  info1?: string,
): ResultModel {
  const sanitizedData = JSON.parse(JSON.stringify(resultData)) as T;
  //console.log('resultQueryDataxxxxxxx');

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
    );
  }
}
