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

export interface TblSupplierFindManagerId extends RowDataPacket {
  ID_FORNECEDOR: number;
  NOME: string | null;
  FISIJURI: string | null;
  FONE1: string | null;
  WHATAPP1: string | null;
  CONTATO1: string | null;
  SETOR1: string | null;
  EMAIL1: string | null;
  PATH_IMAGEM?: string | null;
  ID_PESSOA_TIPO: number | null;
  TIPO_PESSOA: string;
  RAZAO_SOCIAL: string | null;
  CNPJ: string | null;
  INSC_ESTADUAL: string | null;
  INSC_MUNICIPAL: string | null;
  NOME_FANTASIA: string | null;
  DATA_CNPJ: Date | null;
  NOME_RESPONSAVEL: string | null;
  CARGO: string | null;
  CPF: string | null;
  RG: string | null;
  CEP: string | null;
  DATADONASCIMENTO: Date | null;
  ENDERECO: string | null;
  ENDERECO_NUMERO: string | null;
  COMPLEMENTO: string | null;
  BAIRRO: string | null;
  CIDADE: string | null;
  UF: string | null;
  REGIAO_PAIS: string | null;
  PAIS: string | null;
  COD_MUNICIPIO: number | null;
  COD_UF: number | null;
  WEBSITE: string | null;
  FACEBOOK: string | null;
  TWITTER: string | null;
  FRETADOR: number | null;
  INATIVO: number | null;

  DT_ULTIMA_COMPRA: Date | null;
  DT_UPDATE: Date | null;
  DATADOCADASTRO: Date | null;
  ANOTACOES: string | null;
}


export type SpResultRecordCreateType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordUpdateType = [SpDefaultFeedback[], SpOperationResult];
export type SpResultRecordDeleteType = [SpDefaultFeedback[], SpOperationResult];



export type SpResultSupplierFindManagerIdData = [
  TblSupplierFindManagerId[],
  SpDefaultFeedback[],
  SpOperationResult,
];
