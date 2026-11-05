import { Injectable, Logger } from '@nestjs/common';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
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
   */
  async selectQuery<T extends RowDataPacket>(
    queryString: string,
    params?: QueryParams,
  ): Promise<T[]> {
    const [results] = await this.trackOperation('selectQuery', () =>
      this.dbConnection.withConnection((executor) =>
        executor.query<T[]>(queryString, params),
      ),
    );
    return results;
  }

  /**
   * Runs an INSERT, UPDATE, or DELETE through mysql2's `query` API.
   * Build optional SQL clauses from trusted code and pass values through placeholders.
   * Choose dynamic table and column names from an explicit allowlist.
   */
  async mutationQuery(
    queryString: string,
    params?: QueryParams,
  ): Promise<ResultSetHeader> {
    const [results] = await this.trackOperation('mutationQuery', () =>
      this.dbConnection.withConnection((executor) =>
        executor.query<ResultSetHeader>(queryString, params),
      ),
    );
    return results;
  }

  /**
   * Calls an internally selected procedure, optionally qualified as schema.name.
   * Validates and quotes identifiers; values are bound through placeholders.
   * Returns the raw row sets and execution header without changing feedback.
   */
  async callProcedure<T extends RowDataPacket = RowDataPacket>(
    procedureName: string,
    params?: SqlParam[],
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
    const [results] = await this.trackOperation('callProcedure', () =>
      this.dbConnection.withConnection((executor) =>
        executor.execute(`CALL ${identifier}(${placeholders})`, params),
      ),
    );

    // mysql2's generic CALL type does not describe multiple heterogeneous row sets.
    // Row validation remains the responsibility of the result processors.
    return results as unknown as ProcedureResult<T>;
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
