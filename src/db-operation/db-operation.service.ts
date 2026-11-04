import { Injectable, Logger } from '@nestjs/common';
import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DatabaseService } from '../database/database.service.js';
import { QueryParams, SqlParam } from '../database/database.types.js';

@Injectable()
export class DbOperationService {
  // Logger instance
  private readonly logger = new Logger(DbOperationService.name);

  constructor(private readonly database: DatabaseService) {}

  // Método para SELECT (sem transação)
  async selectQuery<T extends RowDataPacket>(
    queryString: string,
    params?: QueryParams,
  ): Promise<T[]> {
    const [results] = await this.database
      .getPool()
      .query<T[]>(queryString, params);
    return results;
  }

 // Insert/Update/Delete usando query
  async ModifyQuery(
    queryString: string,
    params?: QueryParams,
  ): Promise<ResultSetHeader> {
    const [results] = await this.database.getPool().query(queryString, params);
    return results as ResultSetHeader;
  }



  // Método para SELECT com segurança reforçada
  async selectExecute<T extends RowDataPacket>(
    queryString: string,
    params?: QueryParams,
  ): Promise<T[]> {
    const [results] = await this.database
      .getPool()
      .execute<T[]>(queryString, params);
    return results;
  }

  // Insert/Update/Delete usando execute
  async ModifyExecute(
    queryString: string,
    params?: QueryParams,
  ): Promise<ResultSetHeader> {
    const [results] = await this.database
      .getPool()
      .execute(queryString, params);
    return results as ResultSetHeader;
  }

 
  // Operações com transação
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

  //🧪 Exemplo de uso com transação

  /* await this.dbOperationService.runInTransaction(async (conn) => {
  await conn.execute('UPDATE users SET balance = balance - ? WHERE id = ?', [100, 1]);
  await conn.execute('UPDATE users SET balance = balance + ? WHERE id = ?', [100, 2]);
});

 */

  // Para procedimentos armazenados que retornam múltiplos conjuntos de resultados
  async chamarProcedimento<T extends RowDataPacket>(
    nomeProcedimento: string,
    params?: SqlParam[],
  ): Promise<T[][]> {
    const query = `CALL ${nomeProcedimento}(${params ? params.map(() => '?').join(',') : ''})`;
    const [results] = await this.database
      .getPool()
      .execute<T[][]>(query, params);
    return results;
  }
}
