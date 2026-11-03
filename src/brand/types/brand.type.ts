import { RowDataPacket } from 'mysql2';

export interface SpDefaultFeedback extends RowDataPacket {
  sp_return_id: number;
  sp_message: string;
  sp_error_id: number;
}

// Database operation result
export interface SpOperationResult {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
  changedRows: number;
}

export type SpResultRecordCreateType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordUpdateType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordDeleteType = [SpDefaultFeedback[], SpOperationResult];

export interface TblBrandFindALL extends RowDataPacket {
  ID_MARCA: number;
  MARCA: string;
  SLUG: string;
  PATH_IMAGEM: string;
  INATIVO: number;
  DATADOCADASTRO: Date;
}

export interface TblBrandFindSearch extends RowDataPacket {
  ID_MARCA: number;
  MARCA: string;
  SLUG: string;
  PATH_IMAGEM: string;
  INATIVO: number;
  DATADOCADASTRO: Date;
}

export interface TblBrandFindId extends RowDataPacket {
  ID_MARCA: number;
  MARCA: string;
  SLUG: string;
  PATH_IMAGEM: string;
  ANOTACOES: string;
  INATIVO: number;
  DT_UPDATE: Date;
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

export type SpResultBrandFindAllData = [
  TblBrandFindALL[],
  SpDefaultFeedback[],
  SpOperationResult,
];

export type SpResultBrandFindSearchData = [
  TblBrandFindSearch[],
  SpDefaultFeedback[],
  SpOperationResult,
];

export interface TblBrandFindManagerAll extends RowDataPacket {
  ID_MARCA: number;
  MARCA: string;
  SLUG: string;
  PATH_IMAGEM: string | null;
  INATIVO: number;
  DATADOCADASTRO: Date;
}

export type SpResultBrandFindManagerAllData = [
  TblBrandFindManagerAll[],
  SpDefaultFeedback[],
  SpOperationResult,
];

export type SpResultBrandFindIdData = [
  TblBrandFindId[],
  SpDefaultFeedback[],
  SpOperationResult,
];

export type SpResultBrandFindManagerIdData = [
  TblBrandFindId[],
  SpDefaultFeedback[],
  SpOperationResult,
];
