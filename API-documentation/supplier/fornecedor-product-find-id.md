# Endpoint API Reference - Consultar Produtos do Fornecedor

### Descrição

Endpoint para consultar os vínculos entre produtos e fornecedores existentes em `tbl_produto_fornecedor`, cruzados com `tbl_produto`. Todos os filtros são opcionais e a resposta é entregue no result set `Supplier product find id`, com os aliases `PS_*` preservados do contrato legado.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v1/fornecedor-product-find-id` |
| Auth | `Authorization: Bearer {API_KEY}` ou `x-api-key: {API_KEY}` |
| Content-Type | `application/json` |
| Rate Limit | `50000 requisições por minuto` |

## Url Base

A URL base da API é definida pela variável de ambiente `APP_PORT`, com o prefixo global `/api`.
Exemplo: `http://localhost:5577/api`

## Autenticação

A autenticação é **obrigatória**. Utilize um dos seguintes headers:

- **Authorization**: `Bearer {seu_api_key}`
- **x-api-key**: `{seu_api_key}`

Se a chave for inválida ou ausente, a API retornará `401 Unauthorized`.

## Estrutura da Requisição (Body)

| Campo | Tipo | Obrigatório | Descrição | Restrições |
| --- | --- | --- | --- | --- |
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); aceito pelo DTO, mas **não** usado na consulta, como no legado |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_PRODUTO` | number | Não | ID do produto | O filtro `id_tbl_produto = ?` só é aplicado quando o valor é maior que `0` |
| `PE_ID_FORNECEDOR` | number | Não | ID do fornecedor | O filtro `ID_TBL_FORNECEDOR = ?` só é aplicado quando o valor é maior que `0` |
| `PE_PRODUTO_DESCRICAO` | string | Não | Descrição do produto | `LOWER(tbl_produto.produto) LIKE LOWER(?)` aplicado quando o texto não está vazio. Não há `%` automático |
| `PE_COD_PRODUTO_FORN` | string | Não | Código do produto no fornecedor | `LOWER(codigodoproduto) LIKE LOWER(?)` aplicado quando o texto não está vazio. Não há `%` automático |

> A consulta não possui filtro de tenant, porque `tbl_produto_fornecedor` não tem coluna de cliente no contrato legado.

### Exemplo de Requisição

```http
POST /supplier/v1/fornecedor-product-find-id
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_FORNECEDOR": 36971
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Dados carregados com sucesso."` quando há registros ou `"Nenhum produto de fornecedor encontrado."` quando a consulta retorna vazio |
| `recordId` | string | `"1"` quando há registros e `"0"` quando a consulta retorna vazio |
| `data` | object | Objeto com a chave `Supplier product find id`, contendo o array de vínculos |
| `quantity` | number | Quantidade de registros retornados |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

Campos de cada registro em `data["Supplier product find id"]`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `PS_ID_TBL_PRODUTO_FORN` | number | ID do vínculo em `tbl_produto_fornecedor` |
| `PS_ID_PRODUTO` | number | ID do produto em `tbl_produto` |
| `PS_ID_FORNECEDOR` | number | ID do fornecedor |
| `PS_COD_PRODUTO_FORN` | string | Código do produto no fornecedor |
| `PS_PRODUTO` | string | Descrição do produto |
| `PS_INATIVO` | number | Indicador de inatividade do produto |
| `PS_PATH_IMAGEM_VENDA` | string | Caminho da imagem de venda do produto |

### Exemplo de Sucesso (201)

```json
{
    "statusCode": 100200,
    "message": "Dados carregados com sucesso.",
    "recordId": "1",
    "data": {
        "Supplier product find id": [
            {
                "PS_ID_TBL_PRODUTO_FORN": 113034,
                "PS_ID_PRODUTO": 67390,
                "PS_ID_FORNECEDOR": 36971,
                "PS_COD_PRODUTO_FORN": "36634",
                "PS_PRODUTO": "CREME FACIAL AGUA MICELAR IBSA DERMA NAHYCO PROFHILO PURA 400ML",
                "PS_INATIVO": 2,
                "PS_PATH_IMAGEM_VENDA": null
            },
            {
                "PS_ID_TBL_PRODUTO_FORN": 113035,
                "PS_ID_PRODUTO": 67396,
                "PS_ID_FORNECEDOR": 36971,
                "PS_COD_PRODUTO_FORN": "37730",
                "PS_PRODUTO": "CREME FACIAL PEPTIDE SCIENCES GHK-CU COPPER PEPTIDE FACE CREAM 50ML COREANO",
                "PS_INATIVO": 2,
                "PS_PATH_IMAGEM_VENDA": "https://assents01.comsuporte.com.br/uploads/images/2026/09/24/e3807009-7b67-4c16-83f7-bbfc67ad3aa2/creme-facial-ghk-cu-copper-peptide-face-cream-mundial-megastore-original.jpg"
            }
        ]
    },
    "quantity": 2,
    "errorId": 0,
    "info1": ""
}
```

Quando nenhum vínculo atende aos filtros, o retorno mantém `statusCode` `100200`, `message` `"Nenhum produto de fornecedor encontrado."`, `recordId` `"0"`, `data` com o array vazio e `quantity` `0`.

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando um campo obrigatório do contexto está ausente ou um campo desconhecido é enviado:

```json
{
  "message": [
    "ID do usuário é obrigatório.",
    "ID do usuário deve ser um número."
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### 401 Unauthorized

```json
{
  "message": "API key is required",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 404 Erro de Negócio (Exemplo)

Ocorre quando a consulta falha no banco de dados. O HTTP permanece `201`, com o erro representado no envelope:

```json
{
  "statusCode": 100404,
  "message": "Não foi possível consultar os produtos do fornecedor.",
  "recordId": "",
  "data": []
}
```
