/** The pool rejected acquisition because its waiting queue reached the limit. */
export class DatabasePoolQueueFullError extends Error {
  constructor() {
    super('The database connection pool waiting queue is full.');
    this.name = 'DatabasePoolQueueFullError';
  }
}
