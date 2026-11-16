# Endpoint API Reference - Excluir Fornecedor

### Descrição

Endpoint para excluir fisicamente um fornecedor de `tbl_fornecedor`, filtrando por `PE_ID_SYSTEM` (tenant) e `PE_ID_FORNECEDOR`. A operação remove apenas uma linha e não faz exclusão em massa.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v2/fornecedor-delete` |
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
| `PE_PASSKEY` | string | Sim | Passkey de autenticação do contexto | Texto não vazio |
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); usado no filtro `ID_SYSTEM_CLIENTE` |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número não vazio; aceito no contexto, mas **não** usado como filtro |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número não vazio |
| `PE_ID_USUARIO` | string | Sim | ID do usuário | Texto não vazio |
| `PE_ID_FORNECEDOR` | number | Sim | ID do fornecedor a excluir | Número não vazio; usado no filtro `ID_FORNECEDOR` |

### Exemplo de Requisição

```http
POST /supplier/v2/fornecedor-delete
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_PASSKEY": "example-passkey",
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "USER001",
  "PE_ID_FORNECEDOR": 36974
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | Mensagem de feedback |
| `recordId` | string | `"0"` nesta operação (o `insertId` do `DELETE` é `0`, o que prevalece sobre `affectedRows`) |
| `data` | array | Vazio nesta operação |
| `quantity` | number | Quantidade de linhas afetadas |
| `errorId` | number | `0` em caso de sucesso; `206` quando nenhuma linha é afetada |
| `info1` | string | Informação complementar (vazia nesta operação) |

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

```json
{
  "message": [
    "Passkey é obrigatória.",
    "Passkey deve ser um texto."
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Também ocorre quando `PE_ID_FORNECEDOR` não é enviado ou não é numérico.

### 401 Unauthorized

```json
{
  "message": "API key is required",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 422 Erro de Negócio (Exemplo)

Quando nenhum fornecedor é encontrado para o tenant e o ID informado:

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

Em falha de banco de dados:

```json
{
  "statusCode": 100404,
  "message": "Não foi possível excluir o fornecedor.",
  "recordId": "",
  "data": []
}
```
