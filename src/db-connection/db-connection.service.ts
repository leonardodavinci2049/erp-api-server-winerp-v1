import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createPool, Pool, PoolConnection, PoolOptions } from 'mysql2/promise';
import { envs } from '../core/config/envs.js';

@Injectable()
export class DbConnectionService implements OnModuleInit, OnModuleDestroy {
  private readonly poolConnection: Pool;
  private poolClosed = false;
  private lastPoolSaturationWarningAt: number | undefined;
  private readonly logger = new Logger(DbConnectionService.name);

  constructor() {
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
    this.poolConnection.on('enqueue', () => this.logPoolSaturation());
  }

  async onModuleInit(): Promise<void> {
    let connection: PoolConnection | undefined;

    try {
      connection = await this.poolConnection.getConnection();
      this.logger.log('Initial MariaDB connection check succeeded.');
    } catch (error: unknown) {
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
      connection?.release();
    }
  }

  getPool(): Pool {
    return this.poolConnection;
  }

  async getConnection(): Promise<PoolConnection> {
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

  async onModuleDestroy(): Promise<void> {
    await this.closePool();
  }

  private async closePool(): Promise<void> {
    if (this.poolClosed) return;

    this.poolClosed = true;
    await this.poolConnection.end();
    this.logger.log('MariaDB connection pool closed.');
  }

  private getErrorCode(error: unknown): string | undefined {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'string'
    ) {
      return error.code;
    }

    return undefined;
  }

  private logPoolSaturation(): void {
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
