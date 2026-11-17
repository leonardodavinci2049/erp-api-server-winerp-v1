# Endpoint API Reference - Listar Marcas para Combo Box

### Descrição

Endpoint para carregar a lista de marcas ativas (`INATIVO = 0`) do cliente do sistema (`PE_ID_SYSTEM`), em ordem alfabética, no formato simplificado usado por componentes de combo box. A resposta é entregue no result set `Marca AddComboBox`.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/brand/v1/marca-add-combobox` |
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
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); é o filtro de tenant da consulta |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_MARCA` | number | Sim | ID da marca | Inteiro; aceito pelo DTO, mas **não** é usado como filtro. A consulta sempre retorna todas as marcas ativas do tenant |

> O path preserva a grafia original `marca-add-combobox`, com `A` e `C` maiúsculos.

### Exemplo de Requisição

```http
POST /brand/v1/marca-add-combobox
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_MARCA": 0
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Dados carregados com sucesso."` quando há registros ou `"Nenhuma marca encontrada."` quando a consulta retorna vazio |
| `recordId` | string | `"1"` quando há registros e `"0"` quando a consulta retorna vazio |
| `data` | object | Objeto com a chave `Marca AddComboBox`, contendo o array de marcas |
| `quantity` | number | Quantidade de registros retornados |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

Campos de cada registro em `data["Marca AddComboBox"]`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ID_MARCA` | number | ID da marca |
| `ID_PESSOA` | number | Sempre `0` (compatibilidade legada) |
| `NOME` | string | Nome da marca (`COALESCE(NOME, '')`) |
| `ID_IMAGEM` | number | Sempre `0` |
| `PATH_IMAGEM` | string | Caminho da imagem da marca (`COALESCE(PATH_IMAGEM, '')`) |
| `PATH_IMAGEM01` | string | Sempre vazio (compatibilidade legada) |
| `PATH_IMAGEM02` | string | Sempre vazio (compatibilidade legada) |

### Exemplo de Sucesso (201)

A resposta abaixo traz os dois primeiros registros das 12 marcas ativas retornadas para o tenant `1`. O array foi reduzido para fins de documentação; `quantity` mantém o valor real da consulta.

```json
{
  "statusCode": 100200,
  "message": "Dados carregados com sucesso.",
  "recordId": "1",
  "data": {
    "Marca AddComboBox": [
      {
        "ID_MARCA": 11,
        "ID_PESSOA": 0,
        "NOME": "AFNAN",
        "ID_IMAGEM": 0,
        "PATH_IMAGEM": "https://assents01.comsuporte.com.br/uploads/images/2026/09/04/b9b4c3c9-1532-41a6-a4e8-cb42fc34e952/afnan-original.jpg",
        "PATH_IMAGEM01": "",
        "PATH_IMAGEM02": ""
      },
      {
        "ID_MARCA": 523,
        "ID_PESSOA": 0,
        "NOME": "MARCA DOC API 001 ALFA",
        "ID_IMAGEM": 0,
        "PATH_IMAGEM": "/imagens/doc-api/marca-alfa-v2.png",
        "PATH_IMAGEM01": "",
        "PATH_IMAGEM02": ""
      }
    ]
  },
  "quantity": 12,
  "errorId": 0,
  "info1": ""
}
```

Quando o tenant não possui marcas ativas, o retorno mantém `statusCode` `100200`, `message` `"Nenhuma marca encontrada."`, `recordId` `"0"`, `data` com o array vazio e `quantity` `0`.

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando um campo obrigatório do contexto está ausente ou possui tipo inválido:

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
