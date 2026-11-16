import type { FornecedorProductFindIdDto } from '../dto/fornecedor-product-find-id.dto.js';

type QueryParam = string | number;

interface FornecedorProductFindIdQueryResult {
  queryString: string;
  queryParams: QueryParam[];
}

/**
 * Ported from `UpdateCodigoProdutosFornecedor` (`UsvmFornecedor.pas`).
 *
 * Every filter is optional and keeps the original comparison rules: numeric
 * ids are applied only when greater than zero and text filters keep the
 * case-insensitive `LIKE` comparison without adding wildcards.
 */
export function FornecedorProductFindIdQuery(
  dataJsonDto: FornecedorProductFindIdDto,
): FornecedorProductFindIdQueryResult {
  const queryParams: QueryParam[] = [];
  const filters: string[] = ['1 = 1'];

  const olIdProduto = dataJsonDto.PE_ID_PRODUTO ?? 0;
  const olIdFornecedor = dataJsonDto.PE_ID_FORNECEDOR ?? 0;
  const olProdutoDescricao = dataJsonDto.PE_PRODUTO_DESCRICAO ?? '';
  const olCodProdutoForn = dataJsonDto.PE_COD_PRODUTO_FORN ?? '';

  if (olIdProduto > 0) {
    filters.push('tbl_produto_fornecedor.id_tbl_produto = ?');
    queryParams.push(olIdProduto);
  }

  if (olIdFornecedor > 0) {
    filters.push('tbl_produto_fornecedor.ID_TBL_FORNECEDOR = ?');
    queryParams.push(olIdFornecedor);
  }

  if (olProdutoDescricao.trim() !== '') {
    filters.push('LOWER(tbl_produto.produto) LIKE LOWER(?)');
    queryParams.push(olProdutoDescricao);
  }

  if (olCodProdutoForn.trim() !== '') {
    filters.push('LOWER(tbl_produto_fornecedor.codigodoproduto) LIKE LOWER(?)');
    queryParams.push(olCodProdutoForn);
  }

  const queryString = `
    SELECT
      tbl_produto_fornecedor.id_tbl_produto_fornecedor AS PS_ID_TBL_PRODUTO_FORN,
      tbl_produto_fornecedor.id_tbl_produto AS PS_ID_PRODUTO,
      tbl_produto_fornecedor.ID_TBL_FORNECEDOR AS PS_ID_FORNECEDOR,
      tbl_produto_fornecedor.codigodoproduto AS PS_COD_PRODUTO_FORN,
      tbl_produto.produto AS PS_PRODUTO,
      tbl_produto.inativo AS PS_INATIVO,
      tbl_produto.path_imagem AS PS_PATH_IMAGEM_VENDA
    FROM
      tbl_produto_fornecedor
      INNER JOIN tbl_produto
        ON tbl_produto.id_tbl_produto = tbl_produto_fornecedor.ID_TBL_PRODUTO
    WHERE
      ${filters.join('\n      AND ')}
  `;

  return { queryString, queryParams };
}
