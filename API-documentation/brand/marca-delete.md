# Endpoint API Reference - Excluir Marca

### Descrição

Endpoint para excluir fisicamente uma marca do cliente do sistema (`PE_ID_SYSTEM`). O `DELETE` é limitado ao tenant e ao `ID_MARCA` informados, sem exclusão em massa.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/brand/v2/marca-delete` |
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
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); compõe o `WHERE` junto com `PE_ID_MARCA` |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** usado no `DELETE` |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** usado no `DELETE` |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** usado no `DELETE` |
| `PE_ID_MARCA` | number | Sim | ID da marca a excluir | Inteiro maior ou igual a 1 (`@IsInt` e `@Min(1)`) |

### Exemplo de Requisição

```http
POST /brand/v2/marca-delete
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_MARCA": 525
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Operação de marca concluída com sucesso."` ou `"Nenhuma marca foi alterada."` |
| `recordId` | string | `PE_ID_MARCA` informado quando houve exclusão; `"0"` quando nenhuma linha foi afetada |
| `data` | array | Sempre vazio nesta operação |
| `quantity` | number | Quantidade de linhas afetadas |
| `errorId` | number | `0` em caso de sucesso; `206` quando nenhuma linha foi afetada |
| `info1` | string | Informação complementar (presente apenas em caso de sucesso) |

### Exemplo de Sucesso (201)

```json
{
  "statusCode": 100200,
  "message": "Operação de marca concluída com sucesso.",
  "recordId": "525",
  "data": [],
  "quantity": 1,
  "errorId": 0,
  "info1": ""
}
```

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando um campo obrigatório está ausente, um campo desconhecido é enviado ou `PE_ID_MARCA` é menor que 1:

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

Retornado quando nenhuma linha corresponde a `PE_ID_SYSTEM` + `PE_ID_MARCA`:

```json
{
  "statusCode": 100422,
  "message": "Nenhuma marca foi alterada.",
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
  "message": "Não foi possível excluir a marca.",
  "recordId": "",
  "data": []
}
```
