# Endpoint API Reference - Consultar Produtos do Fornecedor

### Descrição

Endpoint para consultar os vínculos entre produtos e fornecedores na tabela `tbl_produto_fornecedor`, com filtros opcionais por produto, fornecedor, descrição do produto e código do produto no fornecedor. A resposta usa o prefixo `PS_` em todas as colunas, conforme o contrato herdado do DataSnap.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v2/fornecedor-product-find-id` |
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

`PE_PASSKEY` não faz parte do corpo da requisição: a autenticação é feita exclusivamente pelos headers acima e o envio desse campo no JSON retorna `400 Bad Request` (`property PE_PASSKEY should not exist`).

## Estrutura da Requisição (Body)

| Campo | Tipo | Obrigatório | Descrição | Restrições |
| --- | --- | --- | --- | --- |
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); não é usado como filtro nesta consulta, que não possui coluna de tenant |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número não vazio; não é usado como filtro |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número não vazio |
| `PE_ID_USUARIO` | string | Sim | ID do usuário | Texto não vazio |
| `PE_ID_PRODUTO` | number | Não | ID do produto (`tbl_produto_fornecedor.id_tbl_produto`) | Aplicado somente quando maior que `0` |
| `PE_ID_FORNECEDOR` | number | Não | ID do fornecedor (`tbl_produto_fornecedor.ID_TBL_FORNECEDOR`) | Aplicado somente quando maior que `0` |
| `PE_PRODUTO_DESCRICAO` | string | Não | Trecho da descrição do produto | Comparação `LIKE` case-insensitive **sem** wildcards automáticos; envie os curingas (por exemplo `%Adaptador%`) quando necessário |
| `PE_COD_PRODUTO_FORN` | string | Não | Código do produto no fornecedor | Comparação `LIKE` case-insensitive sem wildcards automáticos |

### Exemplo de Requisição

```http
POST /supplier/v2/fornecedor-product-find-id
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "USER001",
  "PE_ID_PRODUTO": 65109,
  "PE_ID_FORNECEDOR": 36961,
  "PE_PRODUTO_DESCRICAO": "",
  "PE_COD_PRODUTO_FORN": ""
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | Mensagem de feedback |
| `recordId` | string | `"1"` quando há registros e `"0"` quando a consulta retorna vazio |
| `data` | object | Objeto com a chave `Supplier product find id`, contendo o array de vínculos |
| `quantity` | number | Quantidade de registros retornados |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

Campos de cada registro em `data["Supplier product find id"]`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `PS_ID_TBL_PRODUTO_FORN` | number | ID do vínculo em `tbl_produto_fornecedor` |
| `PS_ID_PRODUTO` | number | ID do produto |
| `PS_ID_FORNECEDOR` | number | ID do fornecedor |
| `PS_COD_PRODUTO_FORN` | string | Código do produto no fornecedor |
| `PS_PRODUTO` | string | Descrição do produto |
| `PS_INATIVO` | number | Indicador de inatividade do produto |
| `PS_PATH_IMAGEM_VENDA` | string | Caminho da imagem de venda |

### Exemplo de Sucesso (201)

```json
{
  "statusCode": 100200,
  "message": "Dados carregados com sucesso.",
  "recordId": "1",
  "data": {
    "Supplier product find id": [
      {
        "PS_ID_TBL_PRODUTO_FORN": 109644,
        "PS_ID_PRODUTO": 65109,
        "PS_ID_FORNECEDOR": 36961,
        "PS_COD_PRODUTO_FORN": "",
        "PS_PRODUTO": "Adaptador Fone Tipo-C Samsung Jack*",
        "PS_INATIVO": 2,
        "PS_PATH_IMAGEM_VENDA": null
      },
      {
        "PS_ID_TBL_PRODUTO_FORN": 111916,
        "PS_ID_PRODUTO": 65109,
        "PS_ID_FORNECEDOR": 36961,
        "PS_COD_PRODUTO_FORN": "65453",
        "PS_PRODUTO": "Adaptador Fone Tipo-C Samsung Jack*",
        "PS_INATIVO": 2,
        "PS_PATH_IMAGEM_VENDA": null
      }
    ]
  },
  "quantity": 2,
  "errorId": 0,
  "info1": ""
}
```

Quando nenhum vínculo é encontrado, o retorno mantém `statusCode` `100200`, `message` `"Nenhum produto de fornecedor encontrado."`, `recordId` `"0"`, `data` com o array vazio e `quantity` `0`.

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Por exemplo, ao omitir `PE_ID_USUARIO`:

```json
{
  "message": [
    "ID do usuário é obrigatório.",
    "ID do usuário deve ser um texto."
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

### 422 Erro de Negócio (Exemplo)

```json
{
  "statusCode": 100404,
  "message": "Não foi possível consultar os produtos do fornecedor.",
  "recordId": "",
  "data": []
}
```
