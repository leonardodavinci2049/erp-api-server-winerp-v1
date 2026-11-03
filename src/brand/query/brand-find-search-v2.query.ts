import { BrandFindSearchV2Dto } from '../dto/brand-find-search-v2.dto.js';

interface BrandFindSearchV2QueryResult {
  queryString: string;
  queryParams: [string, number, number, number];
}

export function BrandFindSearchV2Query(
  dataJsonDto: BrandFindSearchV2Dto,
): BrandFindSearchV2QueryResult {
  const queryString = `
    SELECT
      tbl_produto_marca.ID_MARCA,
      COALESCE(
        tbl_produto_marca.MARCA,
        tbl_produto_marca.NOME
      ) AS MARCA,
      tbl_produto_marca.SLUG,
      tbl_produto_marca.PATH_IMAGEM,
      tbl_produto_marca.INATIVO,
      tbl_produto_marca.DATADOCADASTRO
    FROM
      tbl_produto_marca
    CROSS JOIN (
      SELECT
        ? AS pe_search,
        ? AS pe_inactive
    ) AS query_params
    WHERE
      tbl_produto_marca.ID_SYSTEM_CLIENTE = ?
      AND (
        query_params.pe_search IS NULL
        OR TRIM(query_params.pe_search) = ''
        OR (
          query_params.pe_search REGEXP '^[0-9]+$'
          AND (
            tbl_produto_marca.ID_MARCA = CAST(
              query_params.pe_search AS UNSIGNED
            )
            OR tbl_produto_marca.MARCA LIKE CONCAT(
              '%',
              query_params.pe_search,
              '%'
            )
            OR tbl_produto_marca.NOME LIKE CONCAT(
              '%',
              query_params.pe_search,
              '%'
            )
          )
        )
        OR (
          query_params.pe_search NOT REGEXP '^[0-9]+$'
          AND (
            tbl_produto_marca.MARCA LIKE CONCAT(
              '%',
              query_params.pe_search,
              '%'
            )
            OR tbl_produto_marca.NOME LIKE CONCAT(
              '%',
              query_params.pe_search,
              '%'
            )
          )
        )
      )
      AND (
        query_params.pe_inactive IS NULL
        OR query_params.pe_inactive <= 0
        OR tbl_produto_marca.INATIVO = query_params.pe_inactive
      )
    ORDER BY
      tbl_produto_marca.ID_MARCA DESC
    LIMIT ?
  `;

  const queryParams: BrandFindSearchV2QueryResult['queryParams'] = [
    dataJsonDto.pe_search,
    dataJsonDto.pe_inactive,
    dataJsonDto.pe_system_client_id,
    dataJsonDto.pe_limit,
  ];

  return { queryString, queryParams };
}
