import type { RowDataPacket } from 'mysql2';

export interface SpDefaultFeedback extends RowDataPacket {
  sp_return_id: number;
  sp_message: string;
  sp_error_id: number;
}

export interface SpOperationResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

export type SpResultRecordUpdateType = [
  SpDefaultFeedback[],
  SpOperationResult,
];

export interface TblBrandFindSearch extends RowDataPacket {
  ID_MARCA: number;
  MARCA: string;
  SLUG: string;
  PATH_IMAGEM: string;
  INATIVO: number;
  DATADOCADASTRO: Date;
}

export interface TblBrandFindManagerId extends RowDataPacket {
  ID_MARCA: number;
  MARCA: string;
  SLUG: string;
  PATH_IMAGEM: string;
  ANOTACOES: string;
  INATIVO: number;
  DT_UPDATE: Date;
  DATADOCADASTRO: Date;
}
