import { SupplierFindSearchV2Dto } from '../dto/supplier-find-search-v2.dto';

interface SupplierFindSearchV2QueryResult {
  queryString: string;
  queryParams: [string, number, number];
}

export function SupplierFindSearchV2Query(
  dataJsonDto: SupplierFindSearchV2Dto,
): SupplierFindSearchV2QueryResult {
  const queryString = `
    SELECT
      tbl_fornecedor.ID_FORNECEDOR,
      tbl_fornecedor.NOME AS FORNECEDOR,
      tbl_fornecedor.FONE1,
      tbl_fornecedor.WHATAPP1,
      tbl_fornecedor.RAZAO_SOCIAL,
      tbl_fornecedor.CPF,
      tbl_fornecedor.CNPJ,
      tbl_fornecedor.EMAIL1 AS EMAIL,
      tbl_fornecedor.ID_IMAGEM,
      tbl_fornecedor.PATH_IMAGEM,
      CASE
        WHEN tbl_fornecedor.DT_ULTIMA_COMPRA >= '2020-01-01'
          THEN tbl_fornecedor.DT_ULTIMA_COMPRA
        ELSE NULL
      END AS ULTIMA_COMPRA,
      tbl_fornecedor.UF,
      tbl_fornecedor.CIDADE,
      DATE(tbl_fornecedor.DATADOCADASTRO) AS DATA_CADASTRO
    FROM
      tbl_fornecedor
    CROSS JOIN (
      SELECT ? AS pe_search
    ) AS query_params
    WHERE
      tbl_fornecedor.ID_SYSTEM_CLIENTE = ?
      AND tbl_fornecedor.ID_LOJA = ?
      AND tbl_fornecedor.INATIVO = 0
      AND (
        query_params.pe_search IS NULL
        OR TRIM(query_params.pe_search) = ''
        OR (
          query_params.pe_search REGEXP '^[0-9]+$'
          AND tbl_fornecedor.ID_FORNECEDOR = CAST(
            query_params.pe_search AS UNSIGNED
          )
        )
        OR tbl_fornecedor.NOME LIKE CONCAT('%', query_params.pe_search, '%')
        OR tbl_fornecedor.RAZAO_SOCIAL LIKE CONCAT(
          '%',
          query_params.pe_search,
          '%'
        )
        OR tbl_fornecedor.CPF LIKE CONCAT('%', query_params.pe_search, '%')
        OR tbl_fornecedor.CNPJ LIKE CONCAT('%', query_params.pe_search, '%')
        OR tbl_fornecedor.FONE1 LIKE CONCAT('%', query_params.pe_search, '%')
        OR tbl_fornecedor.WHATAPP1 LIKE CONCAT(
          '%',
          query_params.pe_search,
          '%'
        )
        OR tbl_fornecedor.EMAIL1 LIKE CONCAT('%', query_params.pe_search, '%')
      )
    ORDER BY
      tbl_fornecedor.NOME
    LIMIT 20
  `;

  const queryParams: SupplierFindSearchV2QueryResult['queryParams'] = [
    dataJsonDto.pe_search,
    dataJsonDto.pe_system_client_id,
    dataJsonDto.pe_store_id,
  ];

  return { queryString, queryParams };
}
