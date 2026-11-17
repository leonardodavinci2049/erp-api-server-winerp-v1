# Endpoint API Reference - Consultar Marcas

### Descrição

Endpoint para consultar as marcas ativas (`INATIVO = 0`) do cliente do sistema (`PE_ID_SYSTEM`), com filtro opcional por `ID_MARCA` e por nome. A resposta é entregue no result set `Marca FindAll`, com os aliases `PS_*` preservados do contrato legado.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/brand/v2/marca-find-all` |
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
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); é o único filtro de tenant da consulta |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_MARCA` | number | Sim | ID da marca | Inteiro; o filtro só é aplicado quando o valor é maior que `0`. Envie `0` para não filtrar |
| `PE_MARCA` | string | Sim | Nome da marca ou padrão de busca | O filtro `LOWER(NOME) LIKE LOWER(?)` só é aplicado quando o texto não está vazio. Não há `%` automático: para busca parcial envie o curinga, por exemplo `%DOC API%`. O texto `null` é removido antes da consulta |

### Exemplo de Requisição

```http
POST /brand/v2/marca-find-all
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_MARCA": 0,
  "PE_MARCA": "%MARCA DOC API%"
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Dados carregados com sucesso."` quando há registros ou `"Nenhuma marca encontrada."` quando a consulta retorna vazio |
| `recordId` | string | `"1"` quando há registros e `"0"` quando a consulta retorna vazio |
| `data` | object | Objeto com a chave `Marca FindAll`, contendo o array de marcas |
| `quantity` | number | Quantidade de registros retornados |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

Campos de cada registro em `data["Marca FindAll"]`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `PS_REGISTROS_COUNT` | number | Contador de compatibilidade, sempre `0` |
| `PS_ID_MARCA` | number | ID da marca |
| `PS_ID_PESSOA` | number | Espelho de `PS_ID_MARCA` (compatibilidade legada) |
| `PS_ID_IMAGEM` | number | ID da imagem, sempre `0` |
| `PS_NOME` | string | Nome da marca |
| `PS_MARCA` | string | Espelho de `PS_NOME` (compatibilidade legada) |
| `PS_PATH_IMAGEM` | string | Caminho da imagem da marca |
| `PS_INATIVO` | number | Indicador de inatividade (sempre `0`, pois a consulta filtra ativos) |
| `PS_DATADOCADASTRO` | string | Data de cadastro no formato `YYYY-MM-DD HH:mm:ss` |
| `PS_ANOTACOES` | string | Sempre vazio nesta consulta (compatibilidade legada) |

### Exemplo de Sucesso (201)

```json
{
  "statusCode": 100200,
  "message": "Dados carregados com sucesso.",
  "recordId": "1",
  "data": {
    "Marca FindAll": [
      {
        "PS_REGISTROS_COUNT": 0,
        "PS_ID_MARCA": 523,
        "PS_ID_PESSOA": 523,
        "PS_ID_IMAGEM": 0,
        "PS_NOME": "MARCA DOC API 001 ALFA",
        "PS_MARCA": "MARCA DOC API 001 ALFA",
        "PS_PATH_IMAGEM": "/imagens/doc-api/marca-alfa-v2.png",
        "PS_INATIVO": 0,
        "PS_DATADOCADASTRO": "2026-11-17 08:42:16",
        "PS_ANOTACOES": ""
      },
      {
        "PS_REGISTROS_COUNT": 0,
        "PS_ID_MARCA": 524,
        "PS_ID_PESSOA": 524,
        "PS_ID_IMAGEM": 0,
        "PS_NOME": "MARCA DOC API 002 BETA",
        "PS_MARCA": "MARCA DOC API 002 BETA",
        "PS_PATH_IMAGEM": "/imagens/doc-api/marca-beta.png",
        "PS_INATIVO": 0,
        "PS_DATADOCADASTRO": "2026-11-17 08:42:16",
        "PS_ANOTACOES": ""
      }
    ]
  },
  "quantity": 2,
  "errorId": 0,
  "info1": ""
}
```

Quando nenhuma marca atende aos filtros, o retorno mantém `statusCode` `100200`, `message` `"Nenhuma marca encontrada."`, `recordId` `"0"`, `data` com o array vazio e `quantity` `0`.

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando um campo obrigatório do contexto está ausente, um valor possui tipo inválido ou um campo desconhecido é enviado. O exemplo abaixo omite `PE_ID_DEPARTAMENTO` e `PE_ID_USUARIO`:

```json
{
  "message": [
    "ID do departamento é obrigatório.",
    "ID do departamento deve ser um número.",
    "ID do usuário é obrigatório.",
    "ID do usuário deve ser um número."
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Campo desconhecido:

```json
{
  "message": [
    "property PE_PASSKEY should not exist"
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
  "message": "Não foi possível consultar a marca.",
  "recordId": "",
  "data": []
}
```
