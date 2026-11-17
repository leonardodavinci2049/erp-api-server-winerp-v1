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
