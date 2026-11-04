import { Injectable, Logger } from '@nestjs/common';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { writeLocalLog } from '../core/utils/functions/write_local_log.js';
import { DatabasePoolQueueFullError } from '../db-connection/db-connection.errors.js';
import { DbConnectionService } from '../db-connection/db-connection.service.js';
import {
  ProcedureResult,
  QueryParams,
  SqlParam,
} from '../db-connection/db-connection.types.js';

@Injectable()
export class DbOperationService {
  /** Logs failed operations without SQL, parameters, or driver messages. */
  private readonly logger = new Logger(DbOperationService.name);

  constructor(private readonly dbConnection: DbConnectionService) {}

  /**
   * Runs a read query through mysql2's `query` API.
   * Build optional SQL clauses from trusted code and pass values through placeholders.
   * Choose dynamic identifiers and sort directions from an explicit allowlist.
   * Pass the transaction connection to keep this operation inside that transaction.
   */
  async selectQuery<T extends RowDataPacket>(
    queryString: string,
    params?: QueryParams,
    connection?: PoolConnection,
  ): Promise<T[]> {
    const [results] = await this.withConnection(
      'selectQuery',
      (executor) => executor.query<T[]>(queryString, params),
      connection,
    );
    return results;
  }

  /**
   * Runs an INSERT, UPDATE, or DELETE through mysql2's `query` API.
   * Build optional SQL clauses from trusted code and pass values through placeholders.
   * Choose dynamic table and column names from an explicit allowlist.
   * Pass the transaction connection to keep this operation inside that transaction.
   */
  async mutationQuery(
    queryString: string,
    params?: QueryParams,
    connection?: PoolConnection,
  ): Promise<ResultSetHeader> {
    const [results] = await this.withConnection(
      'mutationQuery',
      (executor) => executor.query<ResultSetHeader>(queryString, params),
      connection,
    );
    return results;
  }

  /**
   * Calls an internally selected procedure, optionally qualified as schema.name.
   * Validates and quotes identifiers; values are bound through placeholders.
   * Returns the raw row sets and execution header without changing feedback.
   * Pass the transaction connection for procedures that do not control transactions.
   */
  async callProcedure<T extends RowDataPacket = RowDataPacket>(
    procedureName: string,
    params?: SqlParam[],
    connection?: PoolConnection,
  ): Promise<ProcedureResult<T>> {
    if (
      !/^[A-Za-z_][A-Za-z0-9_$]*(?:\.[A-Za-z_][A-Za-z0-9_$]*)?$/.test(
        procedureName,
      )
    ) {
      throw new Error('Invalid procedure name.');
    }

    const identifier = procedureName
      .split('.')
      .map((part) => `\`${part}\``)
      .join('.');
    const placeholders = params?.map(() => '?').join(',') ?? '';
    const [results] = await this.withConnection(
      'callProcedure',
      (executor) =>
        executor.execute(`CALL ${identifier}(${placeholders})`, params),
      connection,
    );

    // mysql2's generic CALL type does not describe multiple heterogeneous row sets.
    // Row validation remains the responsibility of the result processors.
    return results as unknown as ProcedureResult<T>;
  }

  /**
   * Runs multiple database operations atomically on one checked-out connection.
   * Use when all callback operations must commit or roll back together, and execute
   * every statement through the provided `connection` rather than the shared pool.
   * Await all operations and throw on business failures to trigger rollback.
   * Do not issue transaction control or statements that implicitly commit here.
   * A failed commit can have an uncertain outcome; this method never retries.
   */
  async runInTransaction<T>(
    callback: (connection: PoolConnection) => Promise<T>,
  ): Promise<T> {
    return this.trackOperation('runInTransaction', async () => {
      const connection = await this.dbConnection.getConnection();
      let transactionStarted = false;
      let canRelease = false;
      let rollbackFailed = false;

      try {
        await connection.beginTransaction();
        transactionStarted = true;
        const result = await callback(connection);
        await connection.commit();
        canRelease = true;
        return result;
      } catch (error) {
        if (transactionStarted) {
          try {
            await connection.rollback();
            canRelease = true;
          } catch {
            rollbackFailed = true;
            this.logger.error(
              'Transaction rollback failed; discarding connection.',
            );
          }
        }
        throw error;
      } finally {
        if (canRelease) {
          connection.release();
        } else {
          connection.destroy();
        }
        // Dispose of the connection before waiting for diagnostic disk I/O.
        if (rollbackFailed) {
          await writeLocalLog(
            DbOperationService.name,
            {
              event: 'database_transaction_rollback_failed',
              operation: 'runInTransaction',
              message: 'Transaction rollback failed; discarding connection.',
            },
            'error',
          );
        }
      }
    });
  }

  /** Borrowed connections stay under their caller's lifecycle and diagnostics. */
  private async withConnection<T>(
    operation: string,
    callback: (connection: PoolConnection) => Promise<T>,
    connection?: PoolConnection,
  ): Promise<T> {
    if (connection) {
      return callback(connection);
    }

    return this.trackOperation(operation, async () => {
      const acquiredConnection = await this.dbConnection.getConnection();
      try {
        return await callback(acquiredConnection);
      } finally {
        acquiredConnection.release();
      }
    });
  }

  /** Includes pool wait and cleanup; successful operations remain silent. */
  private async trackOperation<T>(
    operation: string,
    callback: () => Promise<T>,
  ): Promise<T> {
    const startedAt = performance.now();
    try {
      return await callback();
    } catch (error: unknown) {
      const diagnostic = {
        event: 'database_operation_failed',
        operation,
        reason:
          error instanceof DatabasePoolQueueFullError
            ? 'pool_queue_full'
            : 'operation_failed',
        durationMs: Math.round(performance.now() - startedAt),
      };
      this.logger.error(diagnostic);
      await writeLocalLog(DbOperationService.name, diagnostic, 'error');
      throw error;
    }
  }
}
