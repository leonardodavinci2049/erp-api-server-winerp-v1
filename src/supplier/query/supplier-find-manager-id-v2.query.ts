import { SupplierFindManagerIdV2Dto } from '../dto/supplier-find-manager-id-v2.dto';

interface SupplierFindManagerIdV2QueryResult {
  queryString: string;
  queryParams: [number, number, number];
}

export function SupplierFindManagerIdV2Query(
  dataJsonDto: SupplierFindManagerIdV2Dto,
): SupplierFindManagerIdV2QueryResult {
  const queryString = `
    SELECT
      tbl_fornecedor.ID_FORNECEDOR,

      tbl_fornecedor.NOME,
      tbl_fornecedor.FISIJURI,
      tbl_fornecedor.PATH_IMAGEM,

      tbl_fornecedor.FONE1,
      tbl_fornecedor.WHATAPP1,
      tbl_fornecedor.CONTATO1,
      tbl_fornecedor.SETOR1,
      tbl_fornecedor.EMAIL1,

      tbl_fornecedor.ID_PESSOA_TIPO,
      CASE
        WHEN tbl_fornecedor.ID_PESSOA_TIPO = 1 THEN 'PESSOA FÍSICA'
        ELSE 'PESSOA JURÍDICA'
      END AS TIPO_PESSOA,
      tbl_fornecedor.RAZAO_SOCIAL,
      tbl_fornecedor.CNPJ,
      tbl_fornecedor.INSC_ESTADUAL,
      tbl_fornecedor.INSC_MUNICIPAL,
      tbl_fornecedor.NOME_FANTASIA,
      tbl_fornecedor.DATA_CNPJ,
      tbl_fornecedor.NOME_RESPONSAVEL,
      tbl_fornecedor.CARGO,
      tbl_fornecedor.CPF,
      tbl_fornecedor.RG,
      tbl_fornecedor.CEP,
      tbl_fornecedor.ENDERECO,
      tbl_fornecedor.ENDERECO_NUMERO,
      tbl_fornecedor.COMPLEMENTO,
      tbl_fornecedor.BAIRRO,
      tbl_fornecedor.CIDADE,
      tbl_fornecedor.UF,
      tbl_fornecedor.REGIAO_PAIS,
      tbl_fornecedor.PAIS,
      tbl_fornecedor.COD_MUNICIPIO,
      tbl_fornecedor.COD_UF,
      tbl_fornecedor.WEBSITE,
      tbl_fornecedor.FACEBOOK,
      tbl_fornecedor.TWITTER,
      tbl_fornecedor.FRETADOR,
      tbl_fornecedor.INATIVO,
      tbl_fornecedor.DT_ULTIMA_COMPRA,
      tbl_fornecedor.DATADOCADASTRO,
      tbl_fornecedor.DT_UPDATE,
      tbl_fornecedor.ANOTACOES
    FROM
      tbl_fornecedor
    WHERE
      tbl_fornecedor.ID_SYSTEM_CLIENTE = ?
      AND tbl_fornecedor.ID_LOJA = ?
      AND tbl_fornecedor.ID_FORNECEDOR = ?
    LIMIT 1
  `;

  const queryParams: SupplierFindManagerIdV2QueryResult['queryParams'] = [
    dataJsonDto.pe_system_client_id,
    dataJsonDto.pe_store_id,
    dataJsonDto.pe_supplier_id,
  ];

  return { queryString, queryParams };
}
