# Endpoint API Reference - Excluir Fornecedor

### Descrição

Endpoint para excluir fisicamente um fornecedor do cliente do sistema (`PE_ID_SYSTEM`). A operação é uma porta de `cancelFornecedorV1` (`UsvmFornecedor.pas`); no DataSnap o id é recebido como parâmetro separado e, nesta API, é enviado no corpo JSON.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v1/fornecedor-delete` |
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
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); compõe o `WHERE` junto com `PE_ID_FORNECEDOR` |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** usado no `DELETE` |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** usado no `DELETE` |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** usado no `DELETE` |
| `PE_ID_FORNECEDOR` | number | Sim | ID do fornecedor a excluir | `@IsNumber`; compõe o `WHERE` com `PE_ID_SYSTEM` |

### Exemplo de Requisição

```http
POST /supplier/v1/fornecedor-delete
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_FORNECEDOR": 36978
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Fornecedor excluído com sucesso."` ou `"Nenhum fornecedor foi excluído."` |
| `recordId` | string | Sempre `"0"` nesta operação (o id excluído não é devolvido no envelope) |
| `data` | array | Sempre vazio nesta operação |
| `quantity` | number | Quantidade de linhas afetadas |
| `errorId` | number | `0` em caso de sucesso; `206` quando nenhuma linha foi afetada |
| `info1` | string | Informação complementar (presente apenas em caso de sucesso) |

### Exemplo de Sucesso (201)

```json
{
  "statusCode": 100200,
  "message": "Fornecedor excluído com sucesso.",
  "recordId": "0",
  "data": [],
  "quantity": 1,
  "errorId": 0,
  "info1": ""
}
```

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando um campo obrigatório está ausente, um campo desconhecido é enviado ou `PE_ID_SYSTEM` é menor que 1:

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

### 422 Erro de Negócio (Registro Inexistente)

Retornado quando nenhuma linha corresponde a `PE_ID_SYSTEM` + `PE_ID_FORNECEDOR`:

```json
{
  "statusCode": 100422,
  "message": "Nenhum fornecedor foi excluído.",
  "recordId": "0",
  "data": [],
  "quantity": 0,
  "errorId": 206
}
```

### 404 Erro de Negócio (Exemplo)

Ocorre quando o `DELETE` falha no banco de dados. O HTTP permanece `201`, com o erro representado no envelope:

```json
{
  "statusCode": 100404,
  "message": "Não foi possível excluir o fornecedor.",
  "recordId": "",
  "data": []
}
```
