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
  const release = vi.fn();
  const connection = {
    release,
    query,
    execute,
  };
  const getConnection = vi.fn().mockResolvedValue(connection);
  const getPool = vi.fn(() => ({ query, execute }));
  return {
    query,
    connection,
    execute,
    release,
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

  it.each(operations)(
    '%s identifies queue rejection and includes the time spent acquiring a connection',
    async (operation) => {
      const now = vi.spyOn(performance, 'now').mockReturnValue(100);
      const error = new DatabasePoolQueueFullError();
      mocks.getConnection.mockImplementationOnce(async () => {
        now.mockReturnValue(145);
        throw error;
      });

      const result = service[operation]('sp_test', []);

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
      expect(mocks.query).not.toHaveBeenCalled();
      expect(mocks.execute).not.toHaveBeenCalled();
      expect(mocks.release).not.toHaveBeenCalled();
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

  it('does not emit routine logs for successful queries or procedures', async () => {
    const log = vi.spyOn(Logger.prototype, 'log');
    const warn = vi.spyOn(Logger.prototype, 'warn');
    mocks.query.mockResolvedValueOnce([[{ id: 1 }], []]);
    mocks.query.mockResolvedValueOnce([{ affectedRows: 1 }, []]);
    mocks.execute.mockResolvedValueOnce([[[], { affectedRows: 0 }], []]);

    await service.selectQuery('SELECT ?', [1]);
    await service.mutationQuery('UPDATE tbl SET name = ?', ['test']);
    await service.callProcedure('sp_test', []);

    expect(log).not.toHaveBeenCalled();
    expect(warn).not.toHaveBeenCalled();
    expect(loggerError).not.toHaveBeenCalled();
    expect(mocks.writeLocalLog).not.toHaveBeenCalled();
    expect(mocks.release).toHaveBeenCalledTimes(3);
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
});
