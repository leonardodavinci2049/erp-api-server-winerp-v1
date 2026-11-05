import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { createPool, Pool, PoolConnection, PoolOptions } from 'mysql2/promise';
import { envs } from '../core/config/envs.js';
import { writeLocalLog } from '../core/utils/functions/write_local_log.js';
import { DatabasePoolQueueFullError } from './db-connection.errors.js';

@Injectable()
export class DbConnectionService
  implements OnModuleInit, OnApplicationShutdown
{
  // Pool compartilhado pela aplicação; a promessa evita encerramentos duplicados.
  private readonly poolConnection: Pool;
  private poolClosePromise: Promise<void> | undefined;
  // Limita a frequência dos avisos quando há conexões aguardando na fila.
  private lastPoolSaturationWarningAt: number | undefined;
  private readonly logger = new Logger(DbConnectionService.name);

  constructor() {
    // Usa as configurações validadas e cria o único pool deste serviço.
    const config: PoolOptions = {
      host: envs.DATABASE_HOST,
      port: envs.DATABASE_PORT,
      database: envs.DATABASE_NAME,
      user: envs.DATABASE_USER,
      password: envs.DATABASE_PASSWORD,
      waitForConnections: true,
      connectionLimit: envs.DATABASE_POOL_CONNECTION_LIMIT,
      queueLimit: envs.DATABASE_POOL_QUEUE_LIMIT,
      connectTimeout: envs.DATABASE_CONNECT_TIMEOUT_MS,
    };

    this.poolConnection = createPool(config);
    // O evento acontece quando uma requisição precisa esperar por uma conexão.
    this.poolConnection.on('enqueue', () => this.logPoolSaturation());
  }

  async onModuleInit(): Promise<void> {
    // Só conclui a inicialização do Nest depois de obter uma conexão válida.
    let connection: PoolConnection | undefined;

    try {
      connection = await this.poolConnection.getConnection();
      this.logger.log('Connected to the MariaDB database successfully.');
    } catch (error: unknown) {
      // Em falha, registra apenas um código seguro e encerra o pool parcial.
      await this.logError(
        'database_connection_initialization_failed',
        'Initial MariaDB connection check failed',
        error,
      );
      try {
        await this.closePool();
      } catch {
        // closePool records its own failure; preserve the initialization error.
      }
      throw new Error('Initial MariaDB connection check failed.');
    } finally {
      // Devolve ao pool a conexão usada somente para a verificação inicial.
      connection?.release();
    }
  }

  // Permite que o serviço de operações execute consultas pelo pool compartilhado.
  getPool(): Pool {
    return this.poolConnection;
  }

  async getConnection(): Promise<PoolConnection> {
    // Acquires a connection for database operations.
    try {
      return await this.poolConnection.getConnection();
    } catch (error: unknown) {
      // mysql2 provides no error code for queue rejection. Classify only during
      // acquisition so a SQL error with the same message is not misidentified.
      if (error instanceof Error && error.message === 'Queue limit reached.') {
        await this.logError(
          'database_pool_queue_full',
          'MariaDB connection pool waiting queue is full',
        );
        throw new DatabasePoolQueueFullError();
      }
      await this.logError(
        'database_connection_acquisition_failed',
        'Failed to acquire a MariaDB connection',
        error,
      );
      throw error;
    }
  }

  /** Acquires a connection and returns it to the pool after the callback settles. */
  async withConnection<T>(
    callback: (connection: PoolConnection) => Promise<T>,
  ): Promise<T> {
    const connection = await this.getConnection();
    try {
      return await callback(connection);
    } finally {
      connection.release();
    }
  }

  // O Nest fecha o adaptador HTTP antes deste hook, dando tempo às requisições ativas.
  onApplicationShutdown(): Promise<void> {
    return this.closePool();
  }

  private closePool(): Promise<void> {
    // Todas as chamadas aguardam a mesma tentativa de encerramento e o mesmo resultado.
    // Mantém também a falha para que as chamadas seguintes recebam o mesmo resultado.
    this.poolClosePromise ??= Promise.resolve()
      .then(() => this.poolConnection.end())
      .then(() => {
        this.logger.log('MariaDB connection pool closed.');
      })
      .catch(async (error: unknown) => {
        await this.logError(
          'database_pool_close_failed',
          'Failed to close the MariaDB connection pool',
          error,
        );
        throw error;
      });
    return this.poolClosePromise;
  }

  /** Persist only fixed messages and validated codes, never the driver error. */
  private async logError(
    event: string,
    message: string,
    error?: unknown,
  ): Promise<void> {
    const code = this.getErrorCode(error);
    const safeMessage = `${message}${code ? ` (${code})` : ''}.`;
    this.logger.error(safeMessage);
    // The helper returns false on write failure, preserving the database error.
    await writeLocalLog(
      DbConnectionService.name,
      { event, message: safeMessage, code: code ?? null },
      'error',
    );
  }

  private getErrorCode(error: unknown): string | undefined {
    // Aceita somente códigos curtos no formato usado pelo driver, nunca a mensagem do erro.
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string' &&
      /^[A-Z][A-Z0-9_]{0,63}$/.test(error.code)
    ) {
      return error.code;
    }

    return undefined;
  }

  private logPoolSaturation(): void {
    // Evita repetir o mesmo aviso em toda requisição enquanto o pool estiver cheio.
    const now = Date.now();
    if (
      this.lastPoolSaturationWarningAt !== undefined &&
      now - this.lastPoolSaturationWarningAt < 60_000
    ) {
      return;
    }

    this.lastPoolSaturationWarningAt = now;
    this.logger.warn(
      'MariaDB connection pool is saturated; requests are waiting for a connection.',
    );
  }
}
