import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DbConnectionService } from './db-connection.service.js';
import { DatabasePoolQueueFullError } from './db-connection.errors.js';

const mocks = vi.hoisted(() => {
  const release = vi.fn();
  const getConnection = vi.fn().mockResolvedValue({ release });
  const end = vi.fn().mockResolvedValue(undefined);
  const on = vi.fn();
  const pool = { getConnection, end, on };
  return {
    release,
    getConnection,
    end,
    on,
    pool,
    createPool: vi.fn(() => pool),
    writeLocalLog: vi.fn().mockResolvedValue(true),
  };
});

vi.mock('mysql2/promise', () => ({ createPool: mocks.createPool }));
vi.mock('../core/utils/functions/write_local_log.js', () => ({
  writeLocalLog: mocks.writeLocalLog,
}));
vi.mock('../core/config/envs.js', () => ({
  envs: {
    DATABASE_HOST: 'localhost',
    DATABASE_PORT: 3306,
    DATABASE_NAME: 'test',
    DATABASE_USER: 'test',
    DATABASE_PASSWORD: 'test',
    DATABASE_POOL_CONNECTION_LIMIT: 10,
    DATABASE_POOL_QUEUE_LIMIT: 100,
    DATABASE_CONNECT_TIMEOUT_MS: 10000,
  },
}));

describe('DbConnectionService', () => {
  let module: TestingModule;
  let closed: boolean;

  beforeEach(async () => {
    vi.clearAllMocks();
    closed = false;
    module = await Test.createTestingModule({
      providers: [DbConnectionService],
    }).compile();
  });

  afterEach(async () => {
    try {
      if (!closed) await module.close();
    } finally {
      vi.restoreAllMocks();
    }
  });

  it('cria o pool com a configuração e libera a conexão de verificação', async () => {
    const loggerLog = vi.spyOn(Logger.prototype, 'log');
    await module.init();

    expect(module.get(DbConnectionService)).toBeDefined();
    expect(mocks.createPool).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionLimit: 10,
        queueLimit: 100,
        connectTimeout: 10000,
      }),
    );
    expect(mocks.createPool).toHaveBeenCalledOnce();
    expect(mocks.release).toHaveBeenCalledOnce();
    expect(loggerLog).toHaveBeenCalledWith(
      'Connected to the MariaDB database successfully.',
    );
    expect(mocks.writeLocalLog).not.toHaveBeenCalled();
  });

  it('announces success only after a connection has been acquired', async () => {
    const loggerLog = vi.spyOn(Logger.prototype, 'log');
    let resolveConnection!: (value: { release: typeof mocks.release }) => void;
    mocks.getConnection.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveConnection = resolve;
      }),
    );
    const service = module.get(DbConnectionService);
    const initialization = service.onModuleInit();

    expect(loggerLog).not.toHaveBeenCalled();
    expect(mocks.release).not.toHaveBeenCalled();

    resolveConnection({ release: mocks.release });
    await initialization;

    expect(loggerLog).toHaveBeenCalledExactlyOnceWith(
      'Connected to the MariaDB database successfully.',
    );
    expect(mocks.release).toHaveBeenCalledOnce();
  });

  it('expõe o pool para os serviços de operação', () => {
    const service = module.get(DbConnectionService);
    expect(service.getPool()).toBe(mocks.pool);
  });

  it('withConnection waits for the callback before releasing and returns its result', async () => {
    const service = module.get(DbConnectionService);
    const result = { id: 42 };
    let finishCallback!: (value: typeof result) => void;
    const callback = vi.fn(
      () =>
        new Promise<typeof result>((resolve) => {
          finishCallback = resolve;
        }),
    );

    const pending = service.withConnection(callback);

    await vi.waitFor(() => expect(callback).toHaveBeenCalledOnce());
    expect(callback).toHaveBeenCalledWith({ release: mocks.release });
    expect(mocks.getConnection).toHaveBeenCalledOnce();
    expect(mocks.release).not.toHaveBeenCalled();

    finishCallback(result);
    await expect(pending).resolves.toBe(result);
    expect(mocks.release).toHaveBeenCalledOnce();
    expect(mocks.writeLocalLog).not.toHaveBeenCalled();
  });

  it.each(['sync', 'async'] as const)(
    'withConnection releases the connection and preserves a %s callback failure',
    async (failure) => {
      const service = module.get(DbConnectionService);
      const error = new Error('Callback failed');
      const callback = vi.fn((): Promise<never> => {
        if (failure === 'sync') throw error;
        return Promise.reject(error);
      });

      await expect(service.withConnection(callback)).rejects.toBe(error);

      expect(mocks.release).toHaveBeenCalledOnce();
      expect(mocks.writeLocalLog).not.toHaveBeenCalled();
    },
  );

  it('withConnection does not call the callback or release when acquisition fails', async () => {
    const service = module.get(DbConnectionService);
    const error = new Error('Connection unavailable');
    mocks.getConnection.mockRejectedValueOnce(error);
    const callback = vi.fn().mockResolvedValue(undefined);

    await expect(service.withConnection(callback)).rejects.toBe(error);

    expect(callback).not.toHaveBeenCalled();
    expect(mocks.release).not.toHaveBeenCalled();
  });

  it('encerra o pool quando o módulo é fechado', async () => {
    await module.init();
    await module.close();
    closed = true;
    expect(mocks.end).toHaveBeenCalledOnce();
    expect(mocks.writeLocalLog).not.toHaveBeenCalled();
  });

  it('falha a inicialização e fecha o pool quando o banco está indisponível', async () => {
    const loggerLog = vi.spyOn(Logger.prototype, 'log');
    const connectionError = Object.assign(new Error('private details'), {
      code: 'ECONNREFUSED',
    });
    mocks.getConnection.mockRejectedValueOnce(connectionError);

    await expect(module.init()).rejects.toThrow(
      'Initial MariaDB connection check failed.',
    );
    expect(mocks.end).toHaveBeenCalledOnce();
    expect(loggerLog).not.toHaveBeenCalledWith(
      'Connected to the MariaDB database successfully.',
    );
    expect(mocks.writeLocalLog).toHaveBeenCalledExactlyOnceWith(
      'DbConnectionService',
      {
        event: 'database_connection_initialization_failed',
        message: 'Initial MariaDB connection check failed (ECONNREFUSED).',
        code: 'ECONNREFUSED',
      },
      'error',
    );
  });

  it('classifies a full waiting queue separately from SQL and connection errors', async () => {
    const service = module.get(DbConnectionService);
    mocks.getConnection.mockRejectedValueOnce(
      new Error('Queue limit reached.'),
    );

    await expect(service.getConnection()).rejects.toBeInstanceOf(
      DatabasePoolQueueFullError,
    );
    expect(mocks.release).not.toHaveBeenCalled();
    expect(mocks.writeLocalLog).toHaveBeenCalledExactlyOnceWith(
      'DbConnectionService',
      {
        event: 'database_pool_queue_full',
        message: 'MariaDB connection pool waiting queue is full.',
        code: null,
      },
      'error',
    );
  });

  it('registra somente o código e repassa a falha ao obter conexão', async () => {
    await module.init();
    const service = module.get(DbConnectionService);
    const connectionError = Object.assign(new Error('private details'), {
      code: 'POOL_ERROR',
    });
    const loggerError = vi.spyOn(Logger.prototype, 'error');
    mocks.getConnection.mockRejectedValueOnce(connectionError);

    await expect(service.getConnection()).rejects.toBe(connectionError);
    expect(loggerError).toHaveBeenCalledWith(
      'Failed to acquire a MariaDB connection (POOL_ERROR).',
    );
    expect(mocks.writeLocalLog).toHaveBeenCalledExactlyOnceWith(
      'DbConnectionService',
      {
        event: 'database_connection_acquisition_failed',
        message: 'Failed to acquire a MariaDB connection (POOL_ERROR).',
        code: 'POOL_ERROR',
      },
      'error',
    );
  });

  it('registra saturação do pool no máximo uma vez por minuto', async () => {
    const now = vi.spyOn(Date, 'now').mockReturnValue(1_000_000);
    const service = module.get(DbConnectionService);
    const loggerWarn = vi.spyOn(Logger.prototype, 'warn');
    const [, onSaturation] = mocks.on.mock.calls[0] as [string, () => void];

    onSaturation();
    onSaturation();

    expect(loggerWarn).toHaveBeenCalledOnce();
    expect(loggerWarn).toHaveBeenCalledWith(
      'MariaDB connection pool is saturated; requests are waiting for a connection.',
    );
    now.mockReturnValue(1_059_999);
    onSaturation();
    expect(loggerWarn).toHaveBeenCalledOnce();
    now.mockReturnValue(1_060_000);
    onSaturation();
    expect(loggerWarn).toHaveBeenCalledTimes(2);
    expect(service.getPool()).toBe(mocks.pool);
  });

  it('propaga a falha ao encerrar o pool', async () => {
    const closeError = new Error('pool close failed');
    mocks.end.mockRejectedValueOnce(closeError);

    const service = module.get(DbConnectionService);
    const firstClose = service.onApplicationShutdown();
    const secondClose = service.onApplicationShutdown();

    expect(secondClose).toBe(firstClose);
    await expect(firstClose).rejects.toBe(closeError);
    expect(mocks.end).toHaveBeenCalledOnce();
    expect(mocks.writeLocalLog).toHaveBeenCalledExactlyOnceWith(
      'DbConnectionService',
      {
        event: 'database_pool_close_failed',
        message: 'Failed to close the MariaDB connection pool.',
        code: null,
      },
      'error',
    );
  });

  it('omits unsafe driver codes and messages from persisted diagnostics', async () => {
    const service = module.get(DbConnectionService);
    const error = Object.assign(new Error('password=private'), {
      code: 'SQL with private data',
      sql: 'SELECT private_data',
    });
    mocks.getConnection.mockRejectedValueOnce(error);

    await expect(service.getConnection()).rejects.toBe(error);

    expect(mocks.writeLocalLog).toHaveBeenCalledExactlyOnceWith(
      'DbConnectionService',
      {
        event: 'database_connection_acquisition_failed',
        message: 'Failed to acquire a MariaDB connection.',
        code: null,
      },
      'error',
    );
  });

  it('preserves acquisition errors when the local log cannot be written', async () => {
    const service = module.get(DbConnectionService);
    const error = new Error('Connection unavailable');
    mocks.getConnection.mockRejectedValueOnce(error);
    mocks.writeLocalLog.mockResolvedValueOnce(false);

    await expect(service.getConnection()).rejects.toBe(error);
    expect(mocks.writeLocalLog).toHaveBeenCalledOnce();
  });

  it('preserves startup failure when cleanup and both log writes fail', async () => {
    const service = module.get(DbConnectionService);
    mocks.getConnection.mockRejectedValueOnce(
      new Error('Connection unavailable'),
    );
    mocks.end.mockRejectedValueOnce(new Error('Pool close failed'));
    mocks.writeLocalLog
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false);

    await expect(service.onModuleInit()).rejects.toThrow(
      'Initial MariaDB connection check failed.',
    );
    expect(mocks.end).toHaveBeenCalledOnce();
    expect(mocks.writeLocalLog).toHaveBeenCalledTimes(2);
  });
});
