import { BrandFindManagerIdV2Dto } from '../dto/brand-find-manager-id_v2.dto.js';

interface BrandFindManagerIdV2QueryResult {
  queryString: string;
  queryParams: [number, number, number];
}

export function BrandFindManagerIdV2Query(
  dataJsonDto: BrandFindManagerIdV2Dto,
): BrandFindManagerIdV2QueryResult {
  const queryString = `
    SELECT
      tbl_produto_marca.ID_MARCA,     
      COALESCE(NULLIF(tbl_produto_marca.MARCA, ''), tbl_produto_marca.NOME) AS MARCA, 
      tbl_produto_marca.SLUG,
      tbl_produto_marca.PATH_IMAGEM,
      tbl_produto_marca.ANOTACOES,          
      tbl_produto_marca.INATIVO, 
      tbl_produto_marca.DT_UPDATE, 
      tbl_produto_marca.DATADOCADASTRO   
    FROM
        tbl_produto_marca
	WHERE  tbl_produto_marca.ID_SYSTEM_CLIENTE = ?
    AND tbl_produto_marca.ID_LOJA = ?
    AND tbl_produto_marca.ID_MARCA = ?
    LIMIT 1
  `;

  const queryParams: BrandFindManagerIdV2QueryResult['queryParams'] = [
    dataJsonDto.pe_system_client_id,
    dataJsonDto.pe_store_id,
    dataJsonDto.pe_brand_id,
  ];

  return { queryString, queryParams };
}
