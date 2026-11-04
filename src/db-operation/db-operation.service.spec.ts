import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DbConnectionService } from '../db-connection/db-connection.service.js';
import { DatabasePoolQueueFullError } from '../db-connection/db-connection.errors.js';
import { DbOperationService } from './db-operation.service.js';

vi.mock('../db-connection/db-connection.service.js', () => ({
  DbConnectionService: class DbConnectionService {},
}));

const mocks = vi.hoisted(() => {
  const query = vi.fn();
  const execute = vi.fn();
  const beginTransaction = vi.fn().mockResolvedValue(undefined);
  const commit = vi.fn().mockResolvedValue(undefined);
  const rollback = vi.fn().mockResolvedValue(undefined);
  const release = vi.fn();
  const destroy = vi.fn();
  const connection = {
    beginTransaction,
    commit,
    rollback,
    release,
    destroy,
    query,
    execute,
  };
  const getConnection = vi.fn().mockResolvedValue(connection);
  const getPool = vi.fn(() => ({ query, execute }));
  return {
    query,
    connection,
    execute,
    beginTransaction,
    commit,
    rollback,
    release,
    destroy,
    getConnection,
    getPool,
    writeLocalLog: vi.fn().mockResolvedValue(true),
  };
});

vi.mock('../core/utils/functions/write_local_log.js', () => ({
  writeLocalLog: mocks.writeLocalLog,
}));

describe('DbOperationService', () => {
  const loggerError = vi.fn();
  let module: TestingModule;
  let service: DbOperationService;

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.spyOn(Logger.prototype, 'error').mockImplementation(loggerError);
    module = await Test.createTestingModule({
      providers: [
        DbOperationService,
        {
          provide: DbConnectionService,
          useValue: {
            getPool: mocks.getPool,
            getConnection: mocks.getConnection,
          },
        },
      ],
    }).compile();

    service = module.get<DbOperationService>(DbOperationService);
  });

  afterEach(async () => {
    await module.close();
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('selectQuery returns rows and releases its acquired connection', async () => {
    const rows = [{ id: 1 }] as unknown as RowDataPacket[];
    mocks.query.mockResolvedValueOnce([rows, []]);

    await expect(
      service.selectQuery('SELECT * FROM tbl WHERE id = ?', [1]),
    ).resolves.toEqual(rows);
    expect(mocks.query).toHaveBeenCalledWith(
      'SELECT * FROM tbl WHERE id = ?',
      [1],
    );
    expect(mocks.execute).not.toHaveBeenCalled();
    expect(mocks.getConnection).toHaveBeenCalledOnce();
    expect(mocks.getPool).not.toHaveBeenCalled();
    expect(mocks.release).toHaveBeenCalledOnce();
  });

  it('mutationQuery returns the execution header and releases its connection', async () => {
    const header = { affectedRows: 2 } as unknown as ResultSetHeader;
    mocks.query.mockResolvedValueOnce([header, []]);

    await expect(
      service.mutationQuery('UPDATE tbl SET name = ? WHERE id = ?', [
        'novo',
        1,
      ]),
    ).resolves.toBe(header);
    expect(mocks.query).toHaveBeenCalledWith(
      'UPDATE tbl SET name = ? WHERE id = ?',
      ['novo', 1],
    );
    expect(mocks.release).toHaveBeenCalledOnce();
  });

  it('runs reads and mutations on the transaction connection without using the pool', async () => {
    const rows = [{ id: 42 }];
    const header = { affectedRows: 1 };
    mocks.query
      .mockResolvedValueOnce([rows, []])
      .mockResolvedValueOnce([header, []]);

    await service.runInTransaction(async (connection) => {
      await expect(
        service.selectQuery(
          'SELECT id FROM tbl WHERE id = ?',
          [42],
          connection,
        ),
      ).resolves.toBe(rows);
      await expect(
        service.mutationQuery(
          'UPDATE tbl SET name = ? WHERE id = ?',
          ['Updated', 42],
          connection,
        ),
      ).resolves.toBe(header);
    });

    expect(mocks.query).toHaveBeenNthCalledWith(
      1,
      'SELECT id FROM tbl WHERE id = ?',
      [42],
    );
    expect(mocks.query).toHaveBeenNthCalledWith(
      2,
      'UPDATE tbl SET name = ? WHERE id = ?',
      ['Updated', 42],
    );
    expect(mocks.getPool).not.toHaveBeenCalled();
    expect(mocks.getConnection).toHaveBeenCalledOnce();
    expect(mocks.commit).toHaveBeenCalledOnce();
    expect(mocks.release).toHaveBeenCalledOnce();
  });

  it('rolls back when a query on the transaction connection fails', async () => {
    mocks.query.mockRejectedValueOnce(new Error('Query failed'));

    await expect(
      service.runInTransaction((connection) =>
        service.mutationQuery('DELETE FROM tbl WHERE id = ?', [42], connection),
      ),
    ).rejects.toThrow('Query failed');

    expect(mocks.getPool).not.toHaveBeenCalled();
    expect(mocks.commit).not.toHaveBeenCalled();
    expect(mocks.rollback).toHaveBeenCalledOnce();
    expect(mocks.release).toHaveBeenCalledOnce();
  });

  it('runInTransaction commita e libera a conexão em sucesso', async () => {
    const result = await service.runInTransaction(async (connection) => {
      expect(connection).toBeDefined();
      return 'ok';
    });

    expect(result).toBe('ok');
    expect(mocks.beginTransaction).toHaveBeenCalledOnce();
    expect(mocks.commit).toHaveBeenCalledOnce();
    expect(mocks.rollback).not.toHaveBeenCalled();
    expect(mocks.release).toHaveBeenCalledOnce();
  });

  it('runInTransaction reverte, libera a conexão e repassa o erro em falha', async () => {
    await expect(
      service.runInTransaction(async () => {
        throw new Error('boom');
      }),
    ).rejects.toThrow('boom');

    expect(mocks.beginTransaction).toHaveBeenCalledOnce();
    expect(mocks.rollback).toHaveBeenCalledOnce();
    expect(mocks.commit).not.toHaveBeenCalled();
    expect(mocks.release).toHaveBeenCalledOnce();
  });

  it('preserves the original error and discards the connection if rollback fails', async () => {
    const originalError = new Error('Operation failed');
    mocks.rollback.mockRejectedValueOnce(new Error('Rollback failed'));
    mocks.writeLocalLog.mockImplementationOnce(async () => {
      expect(mocks.destroy).toHaveBeenCalledOnce();
      return true;
    });

    await expect(
      service.runInTransaction(async () => {
        throw originalError;
      }),
    ).rejects.toBe(originalError);

    expect(mocks.rollback).toHaveBeenCalledOnce();
    expect(mocks.commit).not.toHaveBeenCalled();
    expect(mocks.destroy).toHaveBeenCalledOnce();
    expect(mocks.release).not.toHaveBeenCalled();
    expect(mocks.writeLocalLog).toHaveBeenNthCalledWith(
      1,
      'DbOperationService',
      {
        event: 'database_transaction_rollback_failed',
        operation: 'runInTransaction',
        message: 'Transaction rollback failed; discarding connection.',
      },
      'error',
    );
    expect(mocks.writeLocalLog).toHaveBeenCalledTimes(2);
  });

  it('discards the connection without running the callback if begin fails', async () => {
    const error = new Error('Begin failed');
    const callback = vi.fn();
    mocks.beginTransaction.mockRejectedValueOnce(error);

    await expect(service.runInTransaction(callback)).rejects.toBe(error);

    expect(callback).not.toHaveBeenCalled();
    expect(mocks.rollback).not.toHaveBeenCalled();
    expect(mocks.commit).not.toHaveBeenCalled();
    expect(mocks.destroy).toHaveBeenCalledOnce();
    expect(mocks.release).not.toHaveBeenCalled();
  });

  it('attempts rollback and preserves the commit error without retrying', async () => {
    const error = new Error('Commit failed');
    const callback = vi.fn().mockResolvedValue('ok');
    mocks.commit.mockRejectedValueOnce(error);

    await expect(service.runInTransaction(callback)).rejects.toBe(error);

    expect(callback).toHaveBeenCalledOnce();
    expect(mocks.commit).toHaveBeenCalledOnce();
    expect(mocks.rollback).toHaveBeenCalledOnce();
    expect(mocks.release).toHaveBeenCalledOnce();
    expect(mocks.destroy).not.toHaveBeenCalled();
  });

  it('propagates connection acquisition errors without running the callback', async () => {
    const error = new Error('Pool unavailable');
    const callback = vi.fn();
    mocks.getConnection.mockRejectedValueOnce(error);

    await expect(service.runInTransaction(callback)).rejects.toBe(error);

    expect(callback).not.toHaveBeenCalled();
    expect(mocks.beginTransaction).not.toHaveBeenCalled();
    expect(mocks.rollback).not.toHaveBeenCalled();
    expect(mocks.release).not.toHaveBeenCalled();
    expect(mocks.destroy).not.toHaveBeenCalled();
  });

  it('callProcedure monta o CALL com placeholders', async () => {
    const resultSets = [[{ id: 1 }], [{ sp_error_id: 0 }], { affectedRows: 0 }];
    mocks.execute.mockResolvedValueOnce([resultSets, []]);

    await expect(service.callProcedure('sp_teste', [1, 'a'])).resolves.toEqual(
      resultSets,
    );
    expect(mocks.execute).toHaveBeenCalledWith('CALL `sp_teste`(?,?)', [
      1,
      'a',
    ]);
  });

  it('callProcedure preserves mutation feedback and the execution header', async () => {
    const result = [
      [{ sp_return_id: 42, sp_error_id: 0, sp_message: 'Created' }],
      { affectedRows: 1 },
    ];
    mocks.execute.mockResolvedValueOnce([result, []]);

    await expect(
      service.callProcedure('sp_test_create', [null, 42]),
    ).resolves.toBe(result);
    expect(mocks.execute).toHaveBeenCalledWith('CALL `sp_test_create`(?,?)', [
      null,
      42,
    ]);
  });

  it('callProcedure sem parâmetros não gera placeholders', async () => {
    const resultSets = [[], { affectedRows: 0 }];
    mocks.execute.mockResolvedValueOnce([resultSets, []]);

    await expect(service.callProcedure('sp_teste')).resolves.toEqual(
      resultSets,
    );
    expect(mocks.execute).toHaveBeenCalledWith('CALL `sp_teste`()', undefined);
  });
  it.each([
    '',
    'sp_test; DROP TABLE tbl',
    'sp_test()',
    'schema..sp_test',
    'sp`test',
    'sp_test --',
    'schema.name.extra',
  ])(
    'rejects invalid procedure name %j before acquiring the pool',
    async (name) => {
      await expect(service.callProcedure(name)).rejects.toThrow(
        'Invalid procedure name.',
      );
      expect(mocks.getPool).not.toHaveBeenCalled();
      expect(mocks.getConnection).not.toHaveBeenCalled();
      expect(mocks.execute).not.toHaveBeenCalled();
    },
  );

  it('supports a schema-qualified procedure and a header-only response', async () => {
    const header = { affectedRows: 1 };
    mocks.execute.mockResolvedValueOnce([header, []]);

    await expect(service.callProcedure('app.sp_update', [])).resolves.toBe(
      header,
    );
    expect(mocks.execute).toHaveBeenCalledWith('CALL `app`.`sp_update`()', []);
  });

  it('executes a procedure on the supplied transaction connection', async () => {
    const result = [[{ sp_error_id: 0 }], { affectedRows: 1 }];
    mocks.execute.mockResolvedValueOnce([result, []]);

    await expect(
      service.runInTransaction((connection) =>
        service.callProcedure('sp_update', [42], connection),
      ),
    ).resolves.toBe(result);

    expect(mocks.execute).toHaveBeenCalledWith('CALL `sp_update`(?)', [42]);
    expect(mocks.getPool).not.toHaveBeenCalled();
    expect(mocks.commit).toHaveBeenCalledOnce();
  });

  it('propagates procedure errors so the enclosing transaction rolls back', async () => {
    const error = new Error('Procedure failed');
    mocks.execute.mockRejectedValueOnce(error);

    await expect(
      service.runInTransaction((connection) =>
        service.callProcedure('sp_update', [42], connection),
      ),
    ).rejects.toBe(error);

    expect(mocks.commit).not.toHaveBeenCalled();
    expect(mocks.rollback).toHaveBeenCalledOnce();
    expect(mocks.release).toHaveBeenCalledOnce();
    expect(loggerError).toHaveBeenCalledExactlyOnceWith({
      event: 'database_operation_failed',
      operation: 'runInTransaction',
      reason: 'operation_failed',
      durationMs: expect.any(Number),
    });
  });

  const operations = ['selectQuery', 'mutationQuery', 'callProcedure'] as const;

  it.each(operations)(
    '%s releases its connection on failure without leaking SQL or data',
    async (operation) => {
      const error = new Error('private driver details');
      const query = operation === 'callProcedure' ? mocks.execute : mocks.query;
      query.mockRejectedValueOnce(error);

      await expect(
        service[operation]('private_query', ['secret']),
      ).rejects.toBe(error);

      expect(mocks.release).toHaveBeenCalledOnce();
      expect(mocks.destroy).not.toHaveBeenCalled();
      expect(loggerError).toHaveBeenCalledExactlyOnceWith({
        event: 'database_operation_failed',
        operation,
        reason: 'operation_failed',
        durationMs: expect.any(Number),
      });
      expect(mocks.writeLocalLog).toHaveBeenCalledExactlyOnceWith(
        'DbOperationService',
        {
          event: 'database_operation_failed',
          operation,
          reason: 'operation_failed',
          durationMs: expect.any(Number),
        },
        'error',
      );
    },
  );

  it.each([...operations, 'runInTransaction'] as const)(
    '%s identifies queue rejection and includes the time spent acquiring a connection',
    async (operation) => {
      const now = vi.spyOn(performance, 'now').mockReturnValue(100);
      const error = new DatabasePoolQueueFullError();
      mocks.getConnection.mockImplementationOnce(async () => {
        now.mockReturnValue(145);
        throw error;
      });
      const callback = vi.fn();

      const result =
        operation === 'runInTransaction'
          ? service.runInTransaction(callback)
          : service[operation]('sp_test', []);

      await expect(result).rejects.toBe(error);

      expect(loggerError).toHaveBeenCalledExactlyOnceWith({
        event: 'database_operation_failed',
        operation,
        reason: 'pool_queue_full',
        durationMs: 45,
      });
      expect(mocks.writeLocalLog).toHaveBeenCalledExactlyOnceWith(
        'DbOperationService',
        {
          event: 'database_operation_failed',
          operation,
          reason: 'pool_queue_full',
          durationMs: 45,
        },
        'error',
      );
      expect(callback).not.toHaveBeenCalled();
      expect(mocks.query).not.toHaveBeenCalled();
      expect(mocks.execute).not.toHaveBeenCalled();
      expect(mocks.release).not.toHaveBeenCalled();
      expect(mocks.destroy).not.toHaveBeenCalled();
    },
  );

  it('measures acquisition plus execution time on query failure', async () => {
    const now = vi.spyOn(performance, 'now').mockReturnValue(100);
    mocks.getConnection.mockImplementationOnce(async () => {
      now.mockReturnValue(130);
      return mocks.connection;
    });
    const error = new Error('Query failed');
    mocks.query.mockImplementationOnce(async () => {
      now.mockReturnValue(180);
      throw error;
    });

    await expect(service.selectQuery('SELECT ?', [1])).rejects.toBe(error);

    expect(loggerError).toHaveBeenCalledExactlyOnceWith({
      event: 'database_operation_failed',
      operation: 'selectQuery',
      reason: 'operation_failed',
      durationMs: 80,
    });
  });

  it('does not classify a SQL error as a queue rejection based on its message', async () => {
    const error = new Error('Queue limit reached.');
    mocks.query.mockRejectedValueOnce(error);

    await expect(service.selectQuery('SELECT ?', [1])).rejects.toBe(error);

    expect(loggerError).toHaveBeenCalledWith(
      expect.objectContaining({
        reason: 'operation_failed',
      }),
    );
  });

  it.each(operations)(
    '%s leaves a caller-owned connection open even after failure',
    async (operation) => {
      const error = new Error('Query failed');
      const query = operation === 'callProcedure' ? mocks.execute : mocks.query;
      query.mockRejectedValueOnce(error);

      await expect(
        service.runInTransaction(async (connection) => {
          await expect(
            service[operation]('sp_test', [], connection),
          ).rejects.toBe(error);
          expect(mocks.release).not.toHaveBeenCalled();
          expect(mocks.destroy).not.toHaveBeenCalled();
          throw error;
        }),
      ).rejects.toBe(error);

      expect(mocks.getConnection).toHaveBeenCalledOnce();
      expect(mocks.rollback).toHaveBeenCalledOnce();
      expect(mocks.release).toHaveBeenCalledOnce();
      expect(loggerError).toHaveBeenCalledTimes(1);
      expect(mocks.writeLocalLog).toHaveBeenCalledOnce();
    },
  );

  it('does not emit routine logs for successful queries, procedures or transactions', async () => {
    const log = vi.spyOn(Logger.prototype, 'log');
    const warn = vi.spyOn(Logger.prototype, 'warn');
    mocks.query.mockResolvedValueOnce([[{ id: 1 }], []]);
    mocks.query.mockResolvedValueOnce([{ affectedRows: 1 }, []]);
    mocks.execute.mockResolvedValueOnce([[[], { affectedRows: 0 }], []]);

    await service.selectQuery('SELECT ?', [1]);
    await service.mutationQuery('UPDATE tbl SET name = ?', ['test']);
    await service.callProcedure('sp_test', []);
    await service.runInTransaction(async () => 'ok');

    expect(log).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(loggerError).not.toHaveBeenCalled();
    expect(mocks.writeLocalLog).not.toHaveBeenCalled();
    expect(mocks.release).toHaveBeenCalledTimes(4);
  });

  it('releases the connection before awaiting persistence and propagating the query error', async () => {
    const error = new Error('Query failed');
    mocks.query.mockRejectedValueOnce(error);
    let finishWrite!: (result: boolean) => void;
    mocks.writeLocalLog.mockReturnValueOnce(
      new Promise<boolean>((resolve) => {
        finishWrite = resolve;
      }),
    );
    let settled = false;
    const result = service
      .selectQuery('SELECT ?', [1])
      .catch((caught: unknown) => {
        settled = true;
        return caught;
      });

    await vi.waitFor(() => expect(mocks.writeLocalLog).toHaveBeenCalledOnce());
    expect(mocks.release).toHaveBeenCalledOnce();
    expect(settled).toBe(false);

    finishWrite(true);
    await expect(result).resolves.toBe(error);
  });

  it('preserves query errors when persistence returns false', async () => {
    const error = new Error('Query failed');
    mocks.query.mockRejectedValueOnce(error);
    mocks.writeLocalLog.mockResolvedValueOnce(false);

    await expect(service.selectQuery('SELECT ?', [1])).rejects.toBe(error);

    expect(mocks.release).toHaveBeenCalledOnce();
    expect(mocks.writeLocalLog).toHaveBeenCalledOnce();
  });

  it('discards a failed rollback connection even when diagnostic writes fail', async () => {
    const error = new Error('Operation failed');
    mocks.rollback.mockRejectedValueOnce(new Error('Rollback failed'));
    mocks.writeLocalLog
      .mockResolvedValueOnce(false)
      .mockResolvedValueOnce(false);

    await expect(
      service.runInTransaction(async () => {
        throw error;
      }),
    ).rejects.toBe(error);

    expect(mocks.destroy).toHaveBeenCalledOnce();
    expect(mocks.release).not.toHaveBeenCalled();
    expect(mocks.writeLocalLog).toHaveBeenCalledTimes(2);
  });
});
