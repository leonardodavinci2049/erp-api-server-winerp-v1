import type { FornecedorUpdateDto } from '../dto/fornecedor-update.dto.js';
import { toSqlDate } from './fornecedor-date.util.js';

type QueryParam = string | number | null;

interface FornecedorUpdateQueryResult {
  queryString: string;
  queryParams: QueryParam[];
}

/**
 * Ported from `acceptFornecedorV1` (`UsvmFornecedor.pas`).
 *
 * Every column updated by the DataSnap method is kept, including the fact that
 * `DATADONASCIMENTO` is not part of the update. Missing values are stored as
 * `NULL` and the tenant filter keeps using `ID_SYSTEM_CLIENTE`, as in the
 * original statement.
 */
export function FornecedorUpdateQuery(
  dataJsonDto: FornecedorUpdateDto,
): FornecedorUpdateQueryResult {
  const olCategoryId = dataJsonDto.PE_ID_CATEGORIA ?? 0;
  const olTypeId = dataJsonDto.PE_ID_TIPO ?? 0;
  const olMunicipalityCode = dataJsonDto.PE_COD_MUNICIPIO ?? 0;
  const olStateCode = dataJsonDto.PE_COD_UF ?? 0;

  const queryString = `
    UPDATE tbl_fornecedor
    SET
      ID_CATEGORIA = ?, -- PE_ID_CATEGORIA
      ID_TIPO = ?, -- PE_ID_TIPO
      NOME = ?, -- PE_NOME
      FISIJURI = ?, -- PE_FISIJURI
      FONE1 = ?, -- PE_FONE1
      FONE2 = ?, -- PE_FONE2
      WHATAPP1 = ?, -- PE_WHATAPP1
      WHATAPP2 = ?, -- PE_WHATAPP2
      CONTATO1 = ?, -- PE_CONTATO1
      CONTATO2 = ?, -- PE_CONTATO2
      SETOR1 = ?, -- PE_SETOR1
      SETOR2 = ?, -- PE_SETOR2
      EMAIL1 = ?, -- PE_EMAIL1
      EMAIL2 = ?, -- PE_EMAIL2
      RAZAO_SOCIAL = ?, -- PE_RAZAO_SOCIAL
      CNPJ = ?, -- PE_CNPJ
      INSC_ESTADUAL = ?, -- PE_INSC_ESTADUAL
      INSC_MUNICIPAL = ?, -- PE_INSC_MUNICIPAL
      NOME_FANTASIA = ?, -- PE_NOME_FANTASIA
      DATA_CNPJ = ?, -- PE_DATA_CNPJ
      NOME_RESPONSAVEL = ?, -- PE_NOME_RESPONSAVEL
      CARGO_RESPOSNAVEL = ?, -- PE_CARGO_RESPOSNAVEL
      ATIVIDADE_PRINCIPAL = ?, -- PE_ATIVIDADE_PRINCIPAL
      ATIVIDADES_SECUNDARIA1 = ?, -- PE_ATIVIDADES_SECUNDARIA1
      ATIVIDADES_SECUNDARIA2 = ?, -- PE_ATIVIDADES_SECUNDARIA2
      ATIVIDADES_SECUNDARIA3 = ?, -- PE_ATIVIDADES_SECUNDARIA3
      ATIVIDADES_SECUNDARIA4 = ?, -- PE_ATIVIDADES_SECUNDARIA4
      ATIVIDADES_SECUNDARIA5 = ?, -- PE_ATIVIDADES_SECUNDARIA5
      NATUREZA_JURIDICA = ?, -- PE_NATUREZA_JURIDICA
      OBJETIVO_MISSAO = ?, -- PE_OBJETIVO_MISSAO
      MISSAO_VISAO = ?, -- PE_MISSAO_VISAO
      PRIMEIRO_NOME = ?, -- PE_PRIMEIRO_NOME
      CARGO = ?, -- PE_CARGO
      CPF = ?, -- PE_CPF
      RG = ?, -- PE_RG
      GENERO = ?, -- PE_GENERO
      SOBRENOME = ?, -- PE_SOBRENOME
      NOME_DO_MEIO = ?, -- PE_NOME_DO_MEIO
      TRATAMENTO = ?, -- PE_TRATAMENTO
      TRABALHANAEMPRESA = ?, -- PE_TRABALHANAEMPRESA
      FORMACAOACADEMICA = ?, -- PE_FORMACAOACADEMICA
      FORMACAOATUAL = ?, -- PE_FORMACAOATUAL
      ESPECIALIZACAO = ?, -- PE_ESPECIALIZACAO
      INSTITUICAODEENSINO = ?, -- PE_INSTITUICAODEENSINO
      CONJUGUE = ?, -- PE_CONJUGUE
      CEP = ?, -- PE_CEP
      ENDERECO = ?, -- PE_ENDERECO
      ENDERECO_NUMERO = ?, -- PE_ENDERECO_NUMERO
      COMPLEMENTO = ?, -- PE_COMPLEMENTO
      BAIRRO = ?, -- PE_BAIRRO
      CIDADE = ?, -- PE_CIDADE
      UF = ?, -- PE_UF
      REGIAO_PAIS = ?, -- PE_REGIAO_PAIS
      PAIS = ?, -- PE_PAIS
      COD_MUNICIPIO = ?, -- PE_COD_MUNICIPIO
      COD_UF = ?, -- PE_COD_UF
      WEBSITE = ?, -- PE_WEBSITE
      SKYPE = ?, -- PE_SKYPE
      FACEBOOK = ?, -- PE_FACEBOOK
      TWITTER = ?, -- PE_TWITTER
      DT_UPDATE = CURRENT_TIMESTAMP,
      ANOTACOES = ? -- PE_ANOTACOES
    WHERE
      ID_SYSTEM_CLIENTE = ? -- PE_ID_SYSTEM
      AND ID_FORNECEDOR = ? -- PE_ID_FORNECEDOR
  `;

  const queryParams: QueryParam[] = [
    olCategoryId,
    olTypeId,
    dataJsonDto.PE_NOME ?? null,
    dataJsonDto.PE_FISIJURI ?? null,
    dataJsonDto.PE_FONE1 ?? null,
    dataJsonDto.PE_FONE2 ?? null,
    dataJsonDto.PE_WHATAPP1 ?? null,
    dataJsonDto.PE_WHATAPP2 ?? null,
    dataJsonDto.PE_CONTATO1 ?? null,
    dataJsonDto.PE_CONTATO2 ?? null,
    dataJsonDto.PE_SETOR1 ?? null,
    dataJsonDto.PE_SETOR2 ?? null,
    dataJsonDto.PE_EMAIL1 ?? null,
    dataJsonDto.PE_EMAIL2 ?? null,
    dataJsonDto.PE_RAZAO_SOCIAL ?? null,
    dataJsonDto.PE_CNPJ ?? null,
    dataJsonDto.PE_INSC_ESTADUAL ?? null,
    dataJsonDto.PE_INSC_MUNICIPAL ?? null,
    dataJsonDto.PE_NOME_FANTASIA ?? null,
    toSqlDate(dataJsonDto.PE_DATA_CNPJ),
    dataJsonDto.PE_NOME_RESPONSAVEL ?? null,
    dataJsonDto.PE_CARGO_RESPOSNAVEL ?? null,
    dataJsonDto.PE_ATIVIDADE_PRINCIPAL ?? null,
    dataJsonDto.PE_ATIVIDADES_SECUNDARIA1 ?? null,
    dataJsonDto.PE_ATIVIDADES_SECUNDARIA2 ?? null,
    dataJsonDto.PE_ATIVIDADES_SECUNDARIA3 ?? null,
    dataJsonDto.PE_ATIVIDADES_SECUNDARIA4 ?? null,
    dataJsonDto.PE_ATIVIDADES_SECUNDARIA5 ?? null,
    dataJsonDto.PE_NATUREZA_JURIDICA ?? null,
    dataJsonDto.PE_OBJETIVO_MISSAO ?? null,
    dataJsonDto.PE_MISSAO_VISAO ?? null,
    dataJsonDto.PE_PRIMEIRO_NOME ?? null,
    dataJsonDto.PE_CARGO ?? null,
    dataJsonDto.PE_CPF ?? null,
    dataJsonDto.PE_RG ?? null,
    dataJsonDto.PE_GENERO ?? null,
    dataJsonDto.PE_SOBRENOME ?? null,
    dataJsonDto.PE_NOME_DO_MEIO ?? null,
    dataJsonDto.PE_TRATAMENTO ?? null,
    dataJsonDto.PE_TRABALHANAEMPRESA ?? null,
    dataJsonDto.PE_FORMACAOACADEMICA ?? null,
    dataJsonDto.PE_FORMACAOATUAL ?? null,
    dataJsonDto.PE_ESPECIALIZACAO ?? null,
    dataJsonDto.PE_INSTITUICAODEENSINO ?? null,
    dataJsonDto.PE_CONJUGUE ?? null,
    dataJsonDto.PE_CEP ?? null,
    dataJsonDto.PE_ENDERECO ?? null,
    dataJsonDto.PE_ENDERECO_NUMERO ?? null,
    dataJsonDto.PE_COMPLEMENTO ?? null,
    dataJsonDto.PE_BAIRRO ?? null,
    dataJsonDto.PE_CIDADE ?? null,
    dataJsonDto.PE_UF ?? null,
    dataJsonDto.PE_REGIAO_PAIS ?? null,
    dataJsonDto.PE_PAIS ?? null,
    olMunicipalityCode,
    olStateCode,
    dataJsonDto.PE_WEBSITE ?? null,
    dataJsonDto.PE_SKYPE ?? null,
    dataJsonDto.PE_FACEBOOK ?? null,
    dataJsonDto.PE_TWITTER ?? null,
    dataJsonDto.PE_ANOTACOES ?? null,
    dataJsonDto.PE_ID_SYSTEM,
    dataJsonDto.PE_ID_FORNECEDOR,
  ];

  return { queryString, queryParams };
}
