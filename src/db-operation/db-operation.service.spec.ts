import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DbConnectionService } from '../db-connection/db-connection.service.js';
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
  const transactionQuery = vi.fn();
  const transactionExecute = vi.fn();
  const connection = {
    beginTransaction,
    commit,
    rollback,
    release,
    destroy,
    query: transactionQuery,
    execute: transactionExecute,
  };
  const getConnection = vi.fn().mockResolvedValue(connection);
  const getPool = vi.fn(() => ({ query, execute }));
  return {
    query,
    transactionQuery,
    transactionExecute,
    execute,
    beginTransaction,
    commit,
    rollback,
    release,
    destroy,
    getConnection,
    getPool,
  };
});

describe('DbOperationService', () => {
  let module: TestingModule;
  let service: DbOperationService;

  beforeEach(async () => {
    vi.clearAllMocks();
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('selectQuery retorna as linhas via pool.query', async () => {
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
  });

  it('mutationQuery retorna o ResultSetHeader via pool.query', async () => {
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
  });

  it('runs reads and mutations on the transaction connection without using the pool', async () => {
    const rows = [{ id: 42 }];
    const header = { affectedRows: 1 };
    mocks.transactionQuery
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

    expect(mocks.transactionQuery).toHaveBeenNthCalledWith(
      1,
      'SELECT id FROM tbl WHERE id = ?',
      [42],
    );
    expect(mocks.transactionQuery).toHaveBeenNthCalledWith(
      2,
      'UPDATE tbl SET name = ? WHERE id = ?',
      ['Updated', 42],
    );
    expect(mocks.getPool).not.toHaveBeenCalled();
    expect(mocks.commit).toHaveBeenCalledOnce();
    expect(mocks.release).toHaveBeenCalledOnce();
  });

  it('rolls back when a query on the transaction connection fails', async () => {
    mocks.transactionQuery.mockRejectedValueOnce(new Error('Query failed'));

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

    await expect(
      service.runInTransaction(async () => {
        throw originalError;
      }),
    ).rejects.toBe(originalError);

    expect(mocks.rollback).toHaveBeenCalledOnce();
    expect(mocks.commit).not.toHaveBeenCalled();
    expect(mocks.destroy).toHaveBeenCalledOnce();
    expect(mocks.release).not.toHaveBeenCalled();
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
    mocks.transactionExecute.mockResolvedValueOnce([result, []]);

    await expect(
      service.runInTransaction((connection) =>
        service.callProcedure('sp_update', [42], connection),
      ),
    ).resolves.toBe(result);

    expect(mocks.transactionExecute).toHaveBeenCalledWith(
      'CALL `sp_update`(?)',
      [42],
    );
    expect(mocks.getPool).not.toHaveBeenCalled();
    expect(mocks.commit).toHaveBeenCalledOnce();
  });

  it('propagates procedure errors so the enclosing transaction rolls back', async () => {
    const error = new Error('Procedure failed');
    mocks.transactionExecute.mockRejectedValueOnce(error);

    await expect(
      service.runInTransaction((connection) =>
        service.callProcedure('sp_update', [42], connection),
      ),
    ).rejects.toBe(error);

    expect(mocks.commit).not.toHaveBeenCalled();
    expect(mocks.rollback).toHaveBeenCalledOnce();
    expect(mocks.release).toHaveBeenCalledOnce();
  });
});
