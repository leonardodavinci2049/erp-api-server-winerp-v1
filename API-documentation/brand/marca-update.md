# Endpoint API Reference - Atualizar Marca

### Descrição

Endpoint para atualizar os dados de uma marca existente do cliente do sistema (`PE_ID_SYSTEM`). A atualização substitui `NOME`, `PATH_IMAGEM`, `ANOTACOES` e `INATIVO` pelo conteúdo enviado, que deve representar o registro completo.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/brand/v1/marca-update` |
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
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** usado no `UPDATE` |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** usado no `UPDATE` |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** usado no `UPDATE` |
| `PE_ID_MARCA` | number | Sim | ID da marca | Inteiro maior ou igual a 1 (`@IsInt` e `@Min(1)`) |
| `PE_NOME` | string | Sim | Nome da marca | `@IsString`; o texto `null` é removido antes da gravação |
| `PE_PATH_IMAGEM` | string | Sim | Caminho da imagem da marca | `@IsString`; gravado em `PATH_IMAGEM` |
| `PE_INATIVO` | number | Sim | Indicador de inatividade | Inteiro; `0` = ativa, `1` = inativa |
| `PE_ANOTACOES` | string | Sim | Observações da marca | `@IsString` |

### Exemplo de Requisição

```http
POST /brand/v1/marca-update
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_MARCA": 523,
  "PE_NOME": "MARCA DOC API 001 ALFA",
  "PE_PATH_IMAGEM": "/imagens/doc-api/marca-alfa-v2.png",
  "PE_INATIVO": 0,
  "PE_ANOTACOES": "Marca atualizada para documentacao do endpoint."
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Operação de marca concluída com sucesso."` ou `"Nenhuma marca foi alterada."` |
| `recordId` | string | `PE_ID_MARCA` informado quando houve atualização; `"0"` quando nenhuma linha foi afetada |
| `data` | array | Sempre vazio nesta operação |
| `quantity` | number | Quantidade de linhas afetadas |
| `errorId` | number | `0` em caso de sucesso; `206` quando nenhuma linha foi afetada |
| `info1` | string | Informação complementar (presente apenas em caso de sucesso) |

### Exemplo de Sucesso (201)

```json
{
  "statusCode": 100200,
  "message": "Operação de marca concluída com sucesso.",
  "recordId": "523",
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

Ocorre quando o `UPDATE` falha no banco de dados. O HTTP permanece `201`, com o erro representado no envelope:

```json
{
  "statusCode": 100404,
  "message": "Não foi possível atualizar a marca.",
  "recordId": "",
  "data": []
}
```
