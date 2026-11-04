import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { createPool, Pool, PoolConnection, PoolOptions } from 'mysql2/promise';
import { envs } from '../core/config/envs.js';

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
      this.logger.log('Initial MariaDB connection check succeeded.');
    } catch (error: unknown) {
      // Em falha, registra apenas um código seguro e encerra o pool parcial.
      const code = this.getErrorCode(error);
      this.logger.error(
        `Initial MariaDB connection check failed${code ? ` (${code})` : ''}.`,
      );
      try {
        await this.closePool();
      } catch {
        this.logger.error(
          'Failed to close the pool after initialization failure.',
        );
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
    // Reserva uma conexão para transações ou operações que precisam dela diretamente.
    try {
      return await this.poolConnection.getConnection();
    } catch (error: unknown) {
      const code = this.getErrorCode(error);
      this.logger.error(
        `Failed to acquire a MariaDB connection${code ? ` (${code})` : ''}.`,
      );
      throw error;
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
      });
    return this.poolClosePromise;
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
