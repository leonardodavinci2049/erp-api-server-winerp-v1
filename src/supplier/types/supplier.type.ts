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

/**
 * Result set of `fornecedor-find-all`, ported from `UpdateFornecedor`.
 * The column names keep the legacy casing (`CARGO_RESPOSNAVEL`, `WHATAPP1`,
 * `MSN`, `FLAG_FABRICANTE`, ...) because they are part of the response
 * contract consumed by WINERP.
 */
export interface TblSupplierFornecedorFindAll extends RowDataPacket {
  ID_FORNECEDOR: number;
  ID_LOJA: number | null;
  ID_USUARIO: number | null;
  ID_DEPARTAMENTO: number | null;
  ID_SYSTEM_CLIENTE: number;

  ID_CATEGORIA: number | null;
  ID_TIPO: number | null;
  ID_IMAGEM: number | null;

  NOME: string | null;
  FISIJURI: string | null;

  FONE1: string | null;
  FONE2: string | null;
  WHATAPP1: string | null;
  WHATAPP2: string | null;
  CONTATO1: string | null;
  CONTATO2: string | null;
  SETOR1: string | null;
  SETOR2: string | null;
  EMAIL1: string | null;
  EMAIL2: string | null;

  RAZAO_SOCIAL: string | null;
  CNPJ: string | null;
  INSC_ESTADUAL: string | null;
  INSC_MUNICIPAL: string | null;
  NOME_FANTASIA: string | null;
  DATA_CNPJ: Date | null;
  NOME_RESPONSAVEL: string | null;
  CARGO_RESPOSNAVEL: string | null;

  ATIVIDADE_PRINCIPAL: string | null;
  ATIVIDADES_SECUNDARIA1: string | null;
  ATIVIDADES_SECUNDARIA2: string | null;
  ATIVIDADES_SECUNDARIA3: string | null;
  ATIVIDADES_SECUNDARIA4: string | null;
  ATIVIDADES_SECUNDARIA5: string | null;

  NATUREZA_JURIDICA: string | null;
  OBJETIVO_MISSAO: string | null;
  MISSAO_VISAO: string | null;

  PRIMEIRO_NOME: string | null;
  CARGO: string | null;

  ID_PESSOA: number;
  ID_EMPRESA: number;
  ID_TABELA: number;
  ID_RESPONSAVEL: number;

  TABELA: string;
  PATH_IMAGEM01: string;
  PATH_IMAGEM02: string;
  GOOGLEPLUS: string;

  CPF: string | null;
  RG: string | null;
  GENERO: string | null;
  SOBRENOME: string | null;
  NOME_DO_MEIO: string | null;

  TRATAMENTO: string | null;
  TRABALHANAEMPRESA: string | null;
  FORMACAOACADEMICA: string | null;
  FORMACAOATUAL: string | null;
  ESPECIALIZACAO: string | null;
  INSTITUICAODEENSINO: string | null;
  CONJUGUE: string | null;
  DATADONASCIMENTO: Date | null;

  CEP: string | null;
  ENDERECO: string | null;
  ENDERECO_NUMERO: string | null;
  COMPLEMENTO: string | null;
  BAIRRO: string | null;
  CIDADE: string | null;
  UF: string | null;
  REGIAO_PAIS: string | null;
  PAIS: string | null;

  FLAG_ENDERECO: number;
  COD_MUNICIPIO: number | null;
  COD_UF: number | null;

  WEBSITE: string | null;
  SKYPE: string | null;
  MSN: string;
  FACEBOOK: string | null;
  TWITTER: string | null;

  FRETADOR: number | null;
  FLAG_FABRICANTE: number;

  DT_ULTIMA_COMPRA: Date | null;
  DT_UPDATE: Date | null;
  DATADOCADASTRO: Date | null;

  ANOTACOES: string | null;
}

/**
 * Result set of `fornecedor-product-find-id`, ported from
 * `UpdateCodigoProdutosFornecedor`. The `PS_` prefixes are part of the legacy
 * response contract.
 */
export interface TblSupplierFornecedorProduct extends RowDataPacket {
  PS_ID_TBL_PRODUTO_FORN: number;
  PS_ID_PRODUTO: number;
  PS_ID_FORNECEDOR: number;
  PS_COD_PRODUTO_FORN: string | null;
  PS_PRODUTO: string | null;
  PS_INATIVO: number | null;
  PS_PATH_IMAGEM_VENDA: string | null;
}
