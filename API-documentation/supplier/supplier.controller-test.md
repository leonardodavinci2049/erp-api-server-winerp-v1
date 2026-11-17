# Relatório de testes HTTP - `src/supplier/supplier.controller.ts`

## Objetivo

Registrar as evidências reais utilizadas na documentação dos endpoints `POST` do `SupplierController`.

## Ambiente

| Item | Valor |
| --- | --- |
| Data da execução | 2026-11-17 |
| Ambiente | desenvolvimento (`APP_ENVIRONMENT` de desenvolvimento) |
| Banco | MariaDB 11.4.13, schema de desenvolvimento (`database01`) |
| API | `http://localhost:5577/api` (`APP_PORT`) |
| Autenticação | `Authorization: Bearer {API_KEY}` lida do `.env` (valor não registrado) |
| Tenant usado | `PE_ID_SYSTEM` = `1`, `PE_ID_LOJA` = `1` |
| Fornecedores de teste criados | `36976` (`FORNECEDOR DOC API 001 ALFA`) e `36977` (`FORNECEDOR DOC API 002 BETA`) |
| Fornecedor criado e excluído no teste | `36978` (`FORNECEDOR DOC API 003 GAMA`) |
| Massa remanescente | os fornecedores `36976` e `36977` permanecem cadastrados no banco de desenvolvimento |
| Fornecedor usado em `fornecedor-product-find-id` | `36971` (`NOVA MED`), com 2 vínculos de produto já existentes em `tbl_produto_fornecedor` |

## Resumo

| # | Endpoint | HTTP | `statusCode` | `errorId` | Resultado |
| --- | --- | --- | --- | --- | --- |
| 1 | `/supplier/v1/fornecedor-create` | 201 | 100200 | 0 | `recordId` `"36976"` |
| 2 | `/supplier/v1/fornecedor-create` | 201 | 100200 | 0 | `recordId` `"36977"` |
| 3 | `/supplier/v1/fornecedor-find-all` | 201 | 100200 | 0 | 2 registros |
| 4 | `/supplier/v1/fornecedor-product-find-id` | 201 | 100200 | 0 | 2 registros |
| 5 | `/supplier/v1/fornecedor-update` | 201 | 100200 | 0 | 1 linha afetada (36976) |
| 6 | `/supplier/v1/fornecedor-create` | 201 | 100200 | 0 | `recordId` `"36978"` |
| 7 | `/supplier/v1/fornecedor-delete` | 201 | 100200 | 0 | 1 linha afetada (36978) |

Testes de erro executados:

| Cenário | HTTP | `statusCode` | Resultado |
| --- | --- | --- | --- |
| Sem header de autenticação | 401 | — | `API key is required` |
| `fornecedor-find-all` sem `PE_ID_USUARIO` | 400 | — | erro do `ValidationPipe` |
| `fornecedor-create` com `PE_WHATSAPP1` (campo desconhecido) | 400 | — | `property PE_WHATSAPP1 should not exist` |
| `fornecedor-create` com `PE_NOME` de 3 caracteres | 400 | — | `PE_NOME deve ter no mínimo 5 caracteres.` |
| `fornecedor-delete` com fornecedor inexistente (`999999`) | 201 | 100422 | `Nenhum fornecedor foi excluído.` (`errorId` 206) |
| `fornecedor-update` com fornecedor inexistente (`999999`) | 201 | 100422 | `Nenhum fornecedor foi atualizado.` (`errorId` 206) |

## 1. `POST /supplier/v1/fornecedor-create`

### Requisição (`36976`)

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_NOME": "FORNECEDOR DOC API 001 ALFA",
  "PE_FISIJURI": "J",
  "PE_CNPJ": "12345678000190",
  "PE_RAZAO_SOCIAL": "FORNECEDOR DOC API 001 ALFA LTDA",
  "PE_NOME_FANTASIA": "ALFA DISTRIBUIDORA",
  "PE_DATA_CNPJ": "2020-01-31",
  "PE_EMAIL1": "alfa.docapi@example.com",
  "PE_FONE1": "11999990001",
  "PE_WHATAPP1": "11999990001",
  "PE_CONTATO1": "Carlos Almeida",
  "PE_SETOR1": "Compras",
  "PE_ATIVIDADE_PRINCIPAL": "Comercio atacadista de materiais de construcao",
  "PE_CEP": "01001000",
  "PE_ENDERECO": "Rua das Industrias",
  "PE_ENDERECO_NUMERO": "100",
  "PE_COMPLEMENTO": "Galpao 2",
  "PE_BAIRRO": "Centro",
  "PE_CIDADE": "Sao Paulo",
  "PE_UF": "SP",
  "PE_PAIS": "Brasil",
  "PE_COD_MUNICIPIO": 3550308,
  "PE_COD_UF": 35,
  "PE_WEBSITE": "https://alfa.docapi.example.com",
  "PE_ANOTACOES": "Fornecedor criado para documentacao do endpoint."
}
```

### Resposta

```json
{
  "statusCode": 100200,
  "message": "Fornecedor criado com sucesso.",
  "recordId": "36976",
  "data": [],
  "quantity": 1,
  "errorId": 0,
  "info1": ""
}
```

O fornecedor `36977` (`FORNECEDOR DOC API 002 BETA`) foi criado com o mesmo fluxo e retornou `recordId` `"36977"`.

## 2. `POST /supplier/v1/fornecedor-find-all`

### Requisição

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_FORNECEDOR": "DOC API"
}
```

### Resposta

Retornou `quantity` 2, com `FORNECEDOR DOC API 001 ALFA` (`36976`) e `FORNECEDOR DOC API 002 BETA` (`36977`). O JSON completo está em `API-documentation/supplier/fornecedor-find-all.md`.

Consulta sem resultado (`PE_FORNECEDOR` `"FORNECEDOR QUE NAO EXISTE"`) retornou HTTP 201, `statusCode` 100200, `message` `"Nenhum fornecedor encontrado."`, `recordId` `"0"`, `data` `{"Supplier find all":[]}` e `quantity` 0.

## 3. `POST /supplier/v1/fornecedor-product-find-id`

### Requisição

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_FORNECEDOR": 36971
}
```

### Resposta

Retornou `quantity` 2 com os vínculos `113034` e `113035` do fornecedor `NOVA MED`. O JSON completo está em `API-documentation/supplier/fornecedor-product-find-id.md`.

Consulta sem resultado (`PE_ID_FORNECEDOR` `999999`) retornou `statusCode` 100200, `message` `"Nenhum produto de fornecedor encontrado."`, `recordId` `"0"`, `data` `{"Supplier product find id":[]}` e `quantity` 0.

## 4. `POST /supplier/v1/fornecedor-update`

### Requisição

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_FORNECEDOR": 36976,
  "PE_NOME": "FORNECEDOR DOC API 001 ALFA",
  "PE_FISIJURI": "J",
  "PE_CNPJ": "12345678000190",
  "PE_RAZAO_SOCIAL": "FORNECEDOR DOC API 001 ALFA LTDA",
  "PE_NOME_FANTASIA": "ALFA DISTRIBUIDORA ATUALIZADA",
  "PE_DATA_CNPJ": "2020-01-31",
  "PE_EMAIL1": "alfa.docapi@example.com",
  "PE_FONE1": "1133334444",
  "PE_WHATAPP1": "11999990001",
  "PE_CONTATO1": "Carlos Almeida",
  "PE_SETOR1": "Compras",
  "PE_ATIVIDADE_PRINCIPAL": "Comercio atacadista de materiais de construcao",
  "PE_CEP": "01001000",
  "PE_ENDERECO": "Rua das Industrias",
  "PE_ENDERECO_NUMERO": "100",
  "PE_COMPLEMENTO": "Galpao 2",
  "PE_BAIRRO": "Centro",
  "PE_CIDADE": "Sao Paulo",
  "PE_UF": "SP",
  "PE_PAIS": "Brasil",
  "PE_COD_MUNICIPIO": 3550308,
  "PE_COD_UF": 35,
  "PE_WEBSITE": "https://alfa.docapi.example.com",
  "PE_ANOTACOES": "Fornecedor atualizado para documentacao do endpoint."
}
```

### Resposta

```json
{
  "statusCode": 100200,
  "message": "Fornecedor atualizado com sucesso.",
  "recordId": "36976",
  "data": [],
  "quantity": 1,
  "errorId": 0,
  "info1": ""
}
```

A atualização sobrescreve todas as colunas previstas no `UPDATE`; os campos não enviados foram gravados como `NULL`, como no legado. O registro completo com os valores remanescentes está em `API-documentation/supplier/fornecedor-update.md`.

## 5. `POST /supplier/v1/fornecedor-delete`

### Requisição

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_FORNECEDOR": 36978
}
```

### Resposta

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

A exclusão é física (`DELETE`) e limitada ao tenant `PE_ID_SYSTEM` e ao `PE_ID_FORNECEDOR` informado.

## 6. Erros observados

```json
{
  "message": "API key is required",
  "error": "Unauthorized",
  "statusCode": 401
}
```

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
  "statusCode": 100422,
  "message": "Nenhum fornecedor foi excluído.",
  "recordId": "0",
  "data": [],
  "quantity": 0,
  "errorId": 206
}
```
