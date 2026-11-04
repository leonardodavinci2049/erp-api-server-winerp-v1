import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DbConnectionService } from './db-connection.service.js';

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
  };
});

vi.mock('mysql2/promise', () => ({ createPool: mocks.createPool }));
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
  });

  it('expõe o pool para os serviços de operação', () => {
    const service = module.get(DbConnectionService);
    expect(service.getPool()).toBe(mocks.pool);
  });

  it('encerra o pool quando o módulo é fechado', async () => {
    await module.init();
    await module.close();
    closed = true;
    expect(mocks.end).toHaveBeenCalledOnce();
  });

  it('falha a inicialização e fecha o pool quando o banco está indisponível', async () => {
    const connectionError = Object.assign(new Error('private details'), {
      code: 'ECONNREFUSED',
    });
    mocks.getConnection.mockRejectedValueOnce(connectionError);

    await expect(module.init()).rejects.toThrow(
      'Initial MariaDB connection check failed.',
    );
    expect(mocks.end).toHaveBeenCalledOnce();
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
  });
});
