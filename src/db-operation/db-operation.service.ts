import { Injectable, Logger } from '@nestjs/common';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DatabaseService } from '../database/database.service.js';
import { QueryParams, SqlParam } from '../database/database.types.js';

@Injectable()
export class DbOperationService {
  /** Logs transaction failures with the service context. */
  private readonly logger = new Logger(DbOperationService.name);

  constructor(private readonly database: DatabaseService) {}

  /**
   * Runs a read query through mysql2's `query` API, outside an explicit transaction.
   * Use when the statement needs `query` behavior; pass values separately in `params`.
   */
  async selectQuery<T extends RowDataPacket>(
    queryString: string,
    params?: QueryParams,
  ): Promise<T[]> {
    const [results] = await this.database
      .getPool()
      .query<T[]>(queryString, params);
    return results;
  }

  /**
   * Runs an INSERT, UPDATE, or DELETE through mysql2's `query` API.
   * Use when the mutation needs `query` behavior; pass values separately in `params`.
   */
  async ModifyQuery(
    queryString: string,
    params?: QueryParams,
  ): Promise<ResultSetHeader> {
    const [results] = await this.database.getPool().query(queryString, params);
    return results as ResultSetHeader;
  }

  /**
   * Runs a read statement through mysql2's prepared-statement `execute` API.
   * Use for parameterized reads; values in `params` are bound to the statement.
   */
  async selectExecute<T extends RowDataPacket>(
    queryString: string,
    params?: QueryParams,
  ): Promise<T[]> {
    const [results] = await this.database
      .getPool()
      .execute<T[]>(queryString, params);
    return results;
  }

  /**
   * Runs an INSERT, UPDATE, or DELETE through mysql2's prepared-statement `execute` API.
   * Use for parameterized mutations; values in `params` are bound to the statement.
   */
  async mutationExecute(
    queryString: string,
    params?: QueryParams,
  ): Promise<ResultSetHeader> {
    const [results] = await this.database
      .getPool()
      .execute(queryString, params);
    return results as ResultSetHeader;
  }

  /**
   * Calls a stored procedure and returns each result set as a separate array.
   * Use when the procedure returns rows; `procedureName` must be a trusted internal
   * identifier because it is inserted into the SQL text, while `params` are bound.
   */
  async selectProcedure<T extends RowDataPacket>(
    procedureName: string,
    params?: SqlParam[],
  ): Promise<T[][]> {
    const query = `CALL ${procedureName}(${params ? params.map(() => '?').join(',') : ''})`;
    const [results] = await this.database
      .getPool()
      .execute<T[][]>(query, params);
    return results;
  }
  /**
   * Runs multiple database operations atomically on one checked-out connection.
   * Use when all callback operations must commit or roll back together, and execute
   * every statement through the provided `connection` rather than the shared pool.
   */
  async runInTransaction<T>(
    callback: (connection: PoolConnection) => Promise<T>,
  ): Promise<T> {
    const connection = await this.database.getConnection();

    try {
      await connection.beginTransaction();
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      this.logger.error('Transação falhou. Revertida.', error);
      throw error;
    } finally {
      connection.release();
    }
  }
}
