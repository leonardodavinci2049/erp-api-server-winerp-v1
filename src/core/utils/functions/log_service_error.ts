import { writeLocalLog } from './write_local_log.js';

const SAFE_ERROR_MESSAGES = new Set([
  'Connection lost: The server closed the connection.',
  'Connection closed.',
  'Pool is closed.',
  'Pool is closed',
  'connect ETIMEDOUT',
]);

export async function logServiceError(
  moduleName: string,
  operation: string,
  error: unknown,
): Promise<void> {
  const message =
    error instanceof Error && SAFE_ERROR_MESSAGES.has(error.message)
      ? error.message
      : 'Error message omitted because it may contain sensitive data.';
  await writeLocalLog(`${moduleName}: ${operation}`, { message }, 'error');
}
