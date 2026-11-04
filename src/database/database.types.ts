// Tipos compatíveis com mysql2 v3.18+
export type SqlParam =
  string | number | bigint | boolean | Date | null | Buffer | Uint8Array;

export type QueryParams = SqlParam[] | { [key: string]: SqlParam };
