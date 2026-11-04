import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DbConnectionService } from './db-connection.service.js';

const mocks = vi.hoisted(() => {
  const release = vi.fn();
  const getConnection = vi.fn().mockResolvedValue({ release });
  const end = vi.fn().mockResolvedValue(undefined);
  const pool = { getConnection, end };
  return {
    release,
    getConnection,
    end,
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
    if (!closed) await module.close();
  });

  it('cria o pool com a configuração e libera a conexão de verificação', async () => {
    expect(module.get(DbConnectionService)).toBeDefined();
    expect(mocks.createPool).toHaveBeenCalledWith(
      expect.objectContaining({
        connectionLimit: 10,
        queueLimit: 100,
        connectTimeout: 10000,
      }),
    );
    await vi.waitFor(() => expect(mocks.release).toHaveBeenCalledOnce());
  });

  it('expõe o pool para os serviços de operação', () => {
    const service = module.get(DbConnectionService);
    expect(service.getPool()).toBe(mocks.pool);
  });

  it('encerra o pool quando o módulo é fechado', async () => {
    await module.close();
    closed = true;
    expect(mocks.end).toHaveBeenCalledOnce();
  });
});
