# AGENTS.md - src/supplier

Este diretório contém a lógica de negócio de fornecedores (`Supplier`). Parte das rotas é uma porta da unidade Pascal `m2-Models/UsvmFornecedor.pas` do projeto `project_webservice`, usada pela integração REST DataSnap.

## Visão geral do módulo

- `dto/`: entrada validada com `class-validator`. Os DTOs portados do DataSnap mantêm os nomes originais dos campos (`pePassKey`, `peIdSystem`, `PE_NOME`, ...) para preservar a assinatura da requisição.
- `query/`: funções puras que retornam `{ queryString, queryParams }` com placeholders `?`. Nenhum valor de DTO é interpolado na string SQL.
- `types/`: interfaces que estendem `RowDataPacket` para os result sets do MySQL.
- `supplier.service.ts`: orquestração, chamada ao `DbOperationService` e montagem do `ResultModel`.
- `supplier.controller.ts`: endpoints `POST` versionados em `v2/` e protegidos por `AuthGuard`.

## Endpoints portados do DataSnap

| Método em `UsvmFornecedor.pas`   | Endpoint (`/api/supplier/...`)  | DTO                          | Query                                 |
| -------------------------------- | ------------------------------- | ---------------------------- | ------------------------------------- |
| `UpdateFornecedor`               | `v2/fornecedor-find-all`        | `FornecedorFindAllDto`       | `fornecedor-find-all.query.ts`        |
| `UpdateCodigoProdutosFornecedor` | `v2/fornecedor-product-find-id` | `FornecedorProductFindIdDto` | `fornecedor-product-find-id.query.ts` |
| `updateFornecedorV1`             | `v2/fornecedor-create`          | `FornecedorCreateDto`        | `fornecedor-create.query.ts`          |
| `acceptFornecedorV1`             | `v2/fornecedor-update`          | `FornecedorUpdateDto`        | `fornecedor-update.query.ts`          |
| `cancelFornecedorV1`             | `v2/fornecedor-delete`          | `FornecedorDeleteDto`        | `fornecedor-delete.query.ts`          |

Os DTOs de create e update compartilham `FornecedorPanelDto` (campos do painel legado) e `FornecedorPayloadDto` (campos `PE_*` do fornecedor); o delete estende apenas o painel. O `PE_NOME` é declarado em cada DTO porque a criação exige no mínimo 5 caracteres, como no legado, e a atualização não.

## Contrato de requisição

- Todas as rotas são `POST` com corpo JSON e autenticação por `Authorization: Bearer <API_KEY>` ou `x-api-key`.
- `peIdSystem` é o identificador do tenant e corresponde a `tbl_fornecedor.ID_SYSTEM_CLIENTE` (`@Min(1)`).
- `peIdLoja`, `peIdDepartamento`, `peIdUsuario` e `pePassKey`/`pePasseKey` são aceitos para manter a mesma assinatura, mas não são usados nas consultas — exatamente como no legado.
- `fornecedor-product-find-id` recebe `PE_ID_PRODUTO`, `PE_ID_FORNECEDOR`, `PE_PRODUTO_DESCRICAO` e `PE_COD_PRODUTO_FORN`; ids menores ou iguais a zero e textos vazios não geram filtro.
- `fornecedor-delete` recebe `PE_ID_FORNECEDOR` no corpo, embora o método DataSnap receba o id como parâmetro separado.
- Datas (`PE_DATA_CNPJ`, `PE_DATADONASCIMENTO`) aceitam `YYYY-MM-DD` ou `DD/MM/YYYY`; valores vazios são gravados como `NULL`.

## Contrato de resposta

As respostas usam o envelope `ResultModel` (`statusCode`, `message`, `recordId`, `data`, `quantity`, `errorId`). Os nomes das colunas dos registros foram preservados com a grafia original do DataSnap, inclusive grafias históricas. A consulta de listagem usa `AS` em todas as colunas para que a resposta não dependa da grafia usada na criação das tabelas:

- `fornecedor-find-all`: `ID_FORNECEDOR`, `ID_LOJA`, `WHATAPP1`, `CARGO_RESPOSNAVEL`, `MSN`, `FLAG_ENDERECO`, `FLAG_FABRICANTE`, `PATH_IMAGEM01`, ... (ver `TblSupplierFornecedorFindAll`).
- `fornecedor-product-find-id`: prefixos `PS_` (`PS_ID_TBL_PRODUTO_FORN`, `PS_COD_PRODUTO_FORN`, `PS_PATH_IMAGEM_VENDA`, ...).
- Mutações: `recordId` recebe o `insertId` na criação, o `PE_ID_FORNECEDOR` na atualização e a quantidade de linhas afetadas na exclusão. Quando nenhuma linha é afetada, o retorno usa `errorId` 206, como o `psCodeErro` legado.

O envelope é diferente do DataSnap (`arrayTable`, `psCodeErro`, `psFeedback`, `psQtRegistros`, `psTempo`). A adaptação desse contrato para os consumidores Delphi pertence à camada de conexão do WINERP.

## Diferenças em relação ao DataSnap

1. **Sem filtro por loja:** as operações de fornecedor usam o tenant apenas por `ID_SYSTEM_CLIENTE`, como o legado: a listagem, a atualização e a exclusão filtram por ele e a criação grava o valor recebido. `peIdLoja` não é usado como filtro nem na inclusão de novos fornecedores. Validar com o banco de desenvolvimento antes de adicionar `ID_LOJA` às consultas, pois registros existentes podem ter valores distintos.
2. **`fornecedor-product-find-id` sem filtro de tenant:** a consulta em `tbl_produto_fornecedor` não possui coluna de tenant no legado e não foi alterada.
3. **Chave primária:** a criação usa o `AUTO_INCREMENT` de `tbl_fornecedor` e devolve `insertId`, em vez de consultar `information_schema.TABLES` antes do `INSERT`.
4. **Valores nulos:** textos ausentes são gravados como `NULL`, e não com a string `"null"` produzida por `TJSONValue.Value` no legado.
5. **Datas ausentes:** são gravadas como `NULL`, e não com a data de fallback (70 anos atrás) do legado.
6. **Atualização completa:** `fornecedor-update` sobrescreve todas as colunas atualizadas pelo legado. O cliente deve enviar o registro completo, como no DataSnap. `DATADONASCIMENTO` não faz parte do `UPDATE`, assim como no original.
7. **Validação:** requisições inválidas retornam erro do `ValidationPipe` (400) em vez de `psCodeErro` 500. Campos desconhecidos são rejeitados (`forbidNonWhitelisted`). `peIdSystem` deve ser maior ou igual a 1 em todas as rotas, inclusive na atualização, em que o legado não fazia essa checagem.
8. **Datas na resposta:** são serializadas em ISO 8601 (`Date` convertido para JSON), enquanto o DataSnap retornava a representação textual do FireDAC.
9. **Exclusão física:** `fornecedor-delete` executa `DELETE` na linha do fornecedor do tenant informado, sem exclusão em massa.

## Convenções locais

1. Novas consultas devem usar placeholders `?` e cláusulas opcionais montadas a partir de código confiável.
2. Reutilize `processSqlResultQuery`, `processSqlResultMutation`, `processProcedureResultMutation` e os tipos de `src/supplier/types/supplier.type.ts`.
3. Testes dos builders ficam em `query/fornecedor.query.spec.ts` e verificam a quantidade de placeholders, a ordem dos parâmetros e os nomes de saída.
