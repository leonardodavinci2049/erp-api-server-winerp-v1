import type { RowDataPacket } from 'mysql2';
import type { ResultSetHeader } from 'mysql2';

export interface TblMarcaFindAll extends RowDataPacket {
  PS_REGISTROS_COUNT: number;
  PS_ID_MARCA: number;
  PS_ID_PESSOA: number;
  PS_ID_IMAGEM: number;
  PS_NOME: string;
  PS_MARCA: string;
  PS_PATH_IMAGEM: string;
  PS_INATIVO: number;
  PS_DATADOCADASTRO: string;
  PS_ANOTACOES: string;
}

export interface TblMarcaAddComboBox extends RowDataPacket {
  ID_MARCA: number;
  ID_PESSOA: number;
  NOME: string;
  ID_IMAGEM: number;
  PATH_IMAGEM: string;
  PATH_IMAGEM01: string;
  PATH_IMAGEM02: string;
}

export type MarcaCreateResult = ResultSetHeader;
export type MarcaUpdateResult = ResultSetHeader;
export type MarcaDeleteResult = ResultSetHeader;

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

export type SpResultRecordUpdateType = [SpDefaultFeedback[], SpOperationResult];

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
