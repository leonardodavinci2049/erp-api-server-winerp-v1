import { Injectable, Logger } from '@nestjs/common';
import { createPool, Pool, PoolConnection, PoolOptions } from 'mysql2/promise';
import { envs } from '../core/config/envs.js';

@Injectable()
export class DatabaseService {
  // Property to hold the connection to MySQL database
  private poolConnection: Pool;
  // Logger instance
  private readonly logger = new Logger(DatabaseService.name);

  // Call the connect method when an instance of DatabaseService is created
  constructor() {
    this.connect();
  }

  public connect() {
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

    // Testa a conexão real com o banco de dados
    this.poolConnection
      .getConnection()
      .then((connection) => {
        this.logger.log(
          `Conectado ao banco de dados MySQL (${envs.DATABASE_HOST}:${envs.DATABASE_PORT})`,
        );
        connection.release();
      })
      .catch((error: Error) => {
        this.logger.error(
          `Falha ao conectar ao banco de dados MySQL (${envs.DATABASE_HOST}:${envs.DATABASE_PORT}): ${error.message}`,
        );
      });
  }

  // Expõe o pool para os serviços de operação (DbOperationService)
  getPool(): Pool {
    return this.poolConnection;
  }

  async getConnection(): Promise<PoolConnection> {
    try {
      return await this.poolConnection.getConnection();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to get database connection: ${message}`, error);
      throw error;
    }
  }

  // Fechamento do pool ao encerrar módulo
  async onModuleDestroy(): Promise<void> {
    await this.poolConnection.end();
    this.logger.log('MySQL connection pool closed');
  }
}

export class ErroConexaoBancoDados extends Error {
  constructor(
    mensagem: string,
    public readonly erroOriginal: Error,
  ) {
    super(mensagem);
    this.name = 'ErroConexaoBancoDados';
  }
}

export class ErroExecucaoConsulta extends Error {
  constructor(
    mensagem: string,
    public readonly consulta: string,
    public readonly erroOriginal: Error,
  ) {
    super(mensagem);
    this.name = 'ErroExecucaoConsulta';
  }
}
