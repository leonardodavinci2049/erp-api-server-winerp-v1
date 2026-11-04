import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

// Tipos compatíveis com mysql2 v3.18+
export type SqlParam =
  string | number | bigint | boolean | Date | null | Buffer | Uint8Array;

export type QueryParams = SqlParam[] | { [key: string]: SqlParam };

/** Raw CALL response: zero or more row sets followed by the execution header. */
export type ProcedureResult<T extends RowDataPacket = RowDataPacket> =
  [...T[][], ResultSetHeader] | ResultSetHeader;
