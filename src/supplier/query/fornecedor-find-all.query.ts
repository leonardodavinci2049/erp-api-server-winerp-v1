import type { FornecedorFindAllDto } from '../dto/fornecedor-find-all.dto.js';

type QueryParam = string | number;

interface FornecedorFindAllQueryResult {
  queryString: string;
  queryParams: QueryParam[];
}

/**
 * Ported from `UpdateFornecedor` (`UsvmFornecedor.pas`).
 *
 * The optional name filter only applies when the legacy value has more than
 * two characters, mirroring the original rule. The method only receives
 * `PE_ID_SYSTEM`, so `PE_ID_LOJA` is accepted by the DTO but not used as a filter,
 * as in the DataSnap implementation.
 *
 * Every column is aliased with the exact legacy response name so the output
 * casing does not depend on how the table was created.
 */
export function FornecedorFindAllQuery(
  dataJsonDto: FornecedorFindAllDto,
): FornecedorFindAllQueryResult {
  const queryParams: QueryParam[] = [dataJsonDto.PE_ID_SYSTEM];
  const filters: string[] = ['tbl_fornecedor.ID_SYSTEM_CLIENTE = ?'];

  const olFornecedor = dataJsonDto.PE_FORNECEDOR ?? '';

  if (olFornecedor.length > 2) {
    filters.push('tbl_fornecedor.NOME LIKE ?');
    queryParams.push(`%${olFornecedor}%`);
  }

  const queryString = `
    SELECT
      tbl_fornecedor.ID_FORNECEDOR AS ID_FORNECEDOR,
      tbl_fornecedor.ID_LOJA AS ID_LOJA,
      tbl_fornecedor.ID_USUARIO AS ID_USUARIO,
      tbl_fornecedor.ID_DEPARTAMENTO AS ID_DEPARTAMENTO,
      tbl_fornecedor.ID_SYSTEM_CLIENTE AS ID_SYSTEM_CLIENTE,

      tbl_fornecedor.ID_CATEGORIA AS ID_CATEGORIA,
      tbl_fornecedor.ID_TIPO AS ID_TIPO,
      tbl_fornecedor.ID_IMAGEM AS ID_IMAGEM,

      tbl_fornecedor.NOME AS NOME,
      tbl_fornecedor.FISIJURI AS FISIJURI,

      tbl_fornecedor.FONE1 AS FONE1,
      tbl_fornecedor.FONE2 AS FONE2,
      tbl_fornecedor.WHATAPP1 AS WHATAPP1,
      tbl_fornecedor.WHATAPP2 AS WHATAPP2,
      tbl_fornecedor.CONTATO1 AS CONTATO1,
      tbl_fornecedor.CONTATO2 AS CONTATO2,
      tbl_fornecedor.SETOR1 AS SETOR1,
      tbl_fornecedor.SETOR2 AS SETOR2,
      tbl_fornecedor.EMAIL1 AS EMAIL1,
      tbl_fornecedor.EMAIL2 AS EMAIL2,

      tbl_fornecedor.RAZAO_SOCIAL AS RAZAO_SOCIAL,
      tbl_fornecedor.CNPJ AS CNPJ,
      tbl_fornecedor.INSC_ESTADUAL AS INSC_ESTADUAL,
      tbl_fornecedor.INSC_MUNICIPAL AS INSC_MUNICIPAL,
      tbl_fornecedor.NOME_FANTASIA AS NOME_FANTASIA,
      tbl_fornecedor.DATA_CNPJ AS DATA_CNPJ,
      tbl_fornecedor.NOME_RESPONSAVEL AS NOME_RESPONSAVEL,
      tbl_fornecedor.CARGO_RESPOSNAVEL AS CARGO_RESPOSNAVEL,

      tbl_fornecedor.ATIVIDADE_PRINCIPAL AS ATIVIDADE_PRINCIPAL,
      tbl_fornecedor.ATIVIDADES_SECUNDARIA1 AS ATIVIDADES_SECUNDARIA1,
      tbl_fornecedor.ATIVIDADES_SECUNDARIA2 AS ATIVIDADES_SECUNDARIA2,
      tbl_fornecedor.ATIVIDADES_SECUNDARIA3 AS ATIVIDADES_SECUNDARIA3,
      tbl_fornecedor.ATIVIDADES_SECUNDARIA4 AS ATIVIDADES_SECUNDARIA4,
      tbl_fornecedor.ATIVIDADES_SECUNDARIA5 AS ATIVIDADES_SECUNDARIA5,

      tbl_fornecedor.NATUREZA_JURIDICA AS NATUREZA_JURIDICA,
      tbl_fornecedor.OBJETIVO_MISSAO AS OBJETIVO_MISSAO,
      tbl_fornecedor.MISSAO_VISAO AS MISSAO_VISAO,

      tbl_fornecedor.PRIMEIRO_NOME AS PRIMEIRO_NOME,
      tbl_fornecedor.CARGO AS CARGO,

      0 AS ID_PESSOA,
      0 AS ID_EMPRESA,
      0 AS ID_TABELA,
      0 AS ID_RESPONSAVEL,

      '' AS TABELA,
      '' AS PATH_IMAGEM01,
      '' AS PATH_IMAGEM02,
      '' AS GOOGLEPLUS,

      tbl_fornecedor.CPF AS CPF,
      tbl_fornecedor.RG AS RG,
      tbl_fornecedor.GENERO AS GENERO,
      tbl_fornecedor.SOBRENOME AS SOBRENOME,
      tbl_fornecedor.NOME_DO_MEIO AS NOME_DO_MEIO,

      tbl_fornecedor.TRATAMENTO AS TRATAMENTO,
      tbl_fornecedor.TRABALHANAEMPRESA AS TRABALHANAEMPRESA,
      tbl_fornecedor.FORMACAOACADEMICA AS FORMACAOACADEMICA,
      tbl_fornecedor.FORMACAOATUAL AS FORMACAOATUAL,
      tbl_fornecedor.ESPECIALIZACAO AS ESPECIALIZACAO,
      tbl_fornecedor.INSTITUICAODEENSINO AS INSTITUICAODEENSINO,
      tbl_fornecedor.CONJUGUE AS CONJUGUE,
      tbl_fornecedor.DATADONASCIMENTO AS DATADONASCIMENTO,

      tbl_fornecedor.CEP AS CEP,
      tbl_fornecedor.ENDERECO AS ENDERECO,
      tbl_fornecedor.ENDERECO_NUMERO AS ENDERECO_NUMERO,
      tbl_fornecedor.COMPLEMENTO AS COMPLEMENTO,
      tbl_fornecedor.BAIRRO AS BAIRRO,
      tbl_fornecedor.CIDADE AS CIDADE,
      tbl_fornecedor.UF AS UF,
      tbl_fornecedor.REGIAO_PAIS AS REGIAO_PAIS,
      tbl_fornecedor.PAIS AS PAIS,

      0 AS FLAG_ENDERECO,
      tbl_fornecedor.COD_MUNICIPIO AS COD_MUNICIPIO,
      tbl_fornecedor.COD_UF AS COD_UF,

      tbl_fornecedor.WEBSITE AS WEBSITE,
      tbl_fornecedor.SKYPE AS SKYPE,
      '' AS MSN,
      tbl_fornecedor.FACEBOOK AS FACEBOOK,
      tbl_fornecedor.TWITTER AS TWITTER,

      tbl_fornecedor.FRETADOR AS FRETADOR,
      0 AS FLAG_FABRICANTE,

      tbl_fornecedor.DT_ULTIMA_COMPRA AS DT_ULTIMA_COMPRA,
      tbl_fornecedor.DT_UPDATE AS DT_UPDATE,
      tbl_fornecedor.DATADOCADASTRO AS DATADOCADASTRO,

      tbl_fornecedor.ANOTACOES AS ANOTACOES
    FROM
      tbl_fornecedor
    WHERE
      ${filters.join('\n      AND ')}
    ORDER BY
      tbl_fornecedor.NOME ASC
  `;

  return { queryString, queryParams };
}
