import { Injectable, Logger } from '@nestjs/common';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DatabaseService } from '../database/database.service.js';
import {
  ProcedureResult,
  QueryParams,
  SqlParam,
} from '../database/database.types.js';

@Injectable()
export class DbOperationService {
  /** Logs transaction failures with the service context. */
  private readonly logger = new Logger(DbOperationService.name);

  constructor(private readonly database: DatabaseService) {}

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
    const executor = connection ?? this.database.getPool();
    const [results] = await executor.query<T[]>(queryString, params);
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
    const executor = connection ?? this.database.getPool();
    const [results] = await executor.query<ResultSetHeader>(
      queryString,
      params,
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
    const executor = connection ?? this.database.getPool();
    const [results] = await executor.execute(
      `CALL ${identifier}(${placeholders})`,
      params,
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
    const connection = await this.database.getConnection();
    let transactionStarted = false;
    let canRelease = false;

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
          this.logger.error(
            'Transaction rollback failed; discarding connection.',
          );
        }
      }
      // Preserve the original error without logging SQL or parameter values.
      this.logger.error('Transaction failed.');
      throw error;
    } finally {
      if (canRelease) {
        connection.release();
      } else {
        connection.destroy();
      }
    }
  }
}
