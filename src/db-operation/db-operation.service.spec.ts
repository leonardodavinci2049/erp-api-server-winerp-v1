import { Test, TestingModule } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { DatabaseService } from '../database/database.service.js';
import { DbOperationService } from './db-operation.service.js';

vi.mock('../database/database.service.js', () => ({
  DatabaseService: class DatabaseService {},
}));

const mocks = vi.hoisted(() => {
  const query = vi.fn();
  const execute = vi.fn();
  const beginTransaction = vi.fn().mockResolvedValue(undefined);
  const commit = vi.fn().mockResolvedValue(undefined);
  const rollback = vi.fn().mockResolvedValue(undefined);
  const release = vi.fn();
  const connection = { beginTransaction, commit, rollback, release };
  const getConnection = vi.fn().mockResolvedValue(connection);
  const getPool = vi.fn(() => ({ query, execute }));
  return {
    query,
    execute,
    beginTransaction,
    commit,
    rollback,
    release,
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
          provide: DatabaseService,
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

  it('selectExecute retorna as linhas via pool.execute', async () => {
    const rows = [{ id: 1 }] as unknown as RowDataPacket[];
    mocks.execute.mockResolvedValueOnce([rows, []]);

    await expect(
      service.selectExecute('SELECT * FROM tbl WHERE id = ?', [1]),
    ).resolves.toEqual(rows);
    expect(mocks.execute).toHaveBeenCalledWith(
      'SELECT * FROM tbl WHERE id = ?',
      [1],
    );
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it('mutationExecute retorna o ResultSetHeader via pool.execute', async () => {
    const header = { affectedRows: 1 } as unknown as ResultSetHeader;
    mocks.execute.mockResolvedValueOnce([header, []]);

    await expect(
      service.mutationExecute('UPDATE tbl SET name = ? WHERE id = ?', [
        'novo',
        1,
      ]),
    ).resolves.toBe(header);
    expect(mocks.execute).toHaveBeenCalledWith(
      'UPDATE tbl SET name = ? WHERE id = ?',
      ['novo', 1],
    );
  });

  it('ModifyQuery retorna o ResultSetHeader via pool.query', async () => {
    const header = { affectedRows: 2 } as unknown as ResultSetHeader;
    mocks.query.mockResolvedValueOnce([header, []]);

    await expect(
      service.ModifyQuery('UPDATE tbl SET name = ? WHERE id = ?', ['novo', 1]),
    ).resolves.toBe(header);
    expect(mocks.query).toHaveBeenCalledWith(
      'UPDATE tbl SET name = ? WHERE id = ?',
      ['novo', 1],
    );
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

  it('selectProcedure monta o CALL com placeholders', async () => {
    const resultSets = [[{ id: 1 }]] as unknown as RowDataPacket[][];
    mocks.execute.mockResolvedValueOnce([resultSets, []]);

    await expect(
      service.selectProcedure('sp_teste', [1, 'a']),
    ).resolves.toEqual(resultSets);
    expect(mocks.execute).toHaveBeenCalledWith('CALL sp_teste(?,?)', [1, 'a']);
  });

  it('selectProcedure sem parâmetros não gera placeholders', async () => {
    const resultSets = [[]] as unknown as RowDataPacket[][];
    mocks.execute.mockResolvedValueOnce([resultSets, []]);

    await expect(service.selectProcedure('sp_teste')).resolves.toEqual(
      resultSets,
    );
    expect(mocks.execute).toHaveBeenCalledWith('CALL sp_teste()', undefined);
  });
});
