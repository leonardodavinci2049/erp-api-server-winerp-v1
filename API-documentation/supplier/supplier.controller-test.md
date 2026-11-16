# Relatório de testes HTTP - `src/supplier/supplier.controller.ts`

## Objetivo

Registrar as evidências reais utilizadas na documentação dos endpoints `POST` do `SupplierController`.

## Ambiente

| Item | Valor |
| --- | --- |
| Data da execução | 2026-11-16 |
| Ambiente | desenvolvimento (`APP_ENVIRONMENT` de desenvolvimento) |
| Banco | MariaDB 11.4.13, schema de desenvolvimento (`database01`) |
| API | `http://localhost:5577/api` (`APP_PORT`) |
| Autenticação | `Authorization: Bearer {API_KEY}` lida do `.env` (valor não registrado) |
| Fornecedor pré-existente usado | `36973` (cliente `1`, loja `1`) |
| Fornecedores de teste criados | `36974` e `36975` (cliente `1`, loja `1`) |
| Limpeza | os dois fornecedores de teste foram excluídos via `fornecedor-delete` ao final |

## Resumo

| # | Endpoint | HTTP | `statusCode` | `errorId` | Resultado |
| --- | --- | --- | --- | --- | --- |
| 1 | `/supplier/v2/fornecedor-create` | 201 | 100200 | 0 | `recordId` `"36974"` |
| 2 | `/supplier/v2/fornecedor-create` | 201 | 100200 | 0 | `recordId` `"36975"` |
| 3 | `/supplier/v2/fornecedor-find-all` | 201 | 100200 | 0 | 2 registros |
| 4 | `/supplier/v2/supplier-find-manager-id` | 201 | 100200 | 0 | 1 registro |
| 5 | `/supplier/v2/fornecedor-product-find-id` | 201 | 100200 | 0 | 2 registros |
| 6 | `/supplier/v2/fornecedor-update` | 201 | 100200 | 0 | 1 linha afetada |
| 7 | `/supplier/v2/fornecedor-delete` | 201 | 100200 | 0 | 1 linha afetada (36975) |
| 8 | `/supplier/v2/fornecedor-delete` | 201 | 100200 | 0 | 1 linha afetada (36974) |

Testes de erro executados:

| Cenário | HTTP | `statusCode` | Resultado |
| --- | --- | --- | --- |
| Sem header de autenticação | 401 | — | `API key is required` |
| `fornecedor-find-all` sem `PE_PASSKEY` | 400 | — | erro do `ValidationPipe` |
| `fornecedor-create` com `PE_WHATSAPP1` (campo desconhecido) | 400 | — | `property PE_WHATSAPP1 should not exist` |
| `supplier-find-manager-id` com fornecedor inexistente | 201 | 100200 | `Supplier find manager Id not found` |
| `fornecedor-delete` com fornecedor inexistente | 201 | 100422 | `Nenhum fornecedor foi excluído.` (`errorId` 206) |

## 1. `POST /supplier/v2/fornecedor-create`

### Requisição

```json
{
  "PE_PASSKEY": "example-passkey",
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "USER001",
  "PE_NOME": "FORNECEDOR DOC API 001 ALFA",
  "PE_FISIJURI": "J",
  "PE_CNPJ": "12345678000190",
  "PE_RAZAO_SOCIAL": "FORNECEDOR DOC API 001 ALFA LTDA",
  "PE_NOME_FANTASIA": "ALFA DISTRIBUIDORA",
  "PE_DATA_CNPJ": "2020-01-31",
  "PE_EMAIL1": "alfa@example.com",
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
  "PE_WEBSITE": "https://alfa.example.com",
  "PE_ANOTACOES": "Fornecedor criado para documentacao do endpoint."
}
```

### Resposta

```json
{
  "statusCode": 100200,
  "message": "Fornecedor criado com sucesso.",
  "recordId": "36974",
  "data": [],
  "quantity": 1,
  "errorId": 0,
  "info1": ""
}
```

O segundo registro (`36975`, `FORNECEDOR DOC API 002 BETA`) foi criado com o mesmo fluxo e retornou `recordId` `"36975"`.

## 2. `POST /supplier/v2/fornecedor-find-all`

### Requisição

```json
{
  "PE_PASSKEY": "example-passkey",
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "USER001",
  "PE_FORNECEDOR": "DOC API"
}
```

### Resposta

Retornou `quantity` 2, com `FORNECEDOR DOC API 001 ALFA` (`36974`) e `FORNECEDOR DOC API 002 BETA` (`36975`). O JSON completo está em `API-documentation/supplier/fornecedor-find-all.md`.

## 3. `POST /supplier/v2/supplier-find-manager-id`

### Requisição

```json
{
  "PE_PASSKEY": "example-passkey",
  "PE_ID_DEPARTAMENTO": 0,
  "pe_app_id": 1,
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "pe_organization_id": "ORG001",
  "PE_ID_USUARIO": "USER001",
  "pe_user_name": "John Doe",
  "pe_user_role": "admin",
  "pe_person_id": 29014,
  "pe_supplier_id": 36974
}
```

### Resposta

```json
{
  "statusCode": 100200,
  "message": "Dados carregados com sucesso.",
  "recordId": "1",
  "data": {
    "Supplier find manager Id": [
      {
        "ID_FORNECEDOR": 36974,
        "NOME": "FORNECEDOR DOC API 001 ALFA",
        "FISIJURI": "J",
        "PATH_IMAGEM": null,
        "FONE1": "11999990001",
        "WHATAPP1": "11999990001",
        "CONTATO1": "Carlos Almeida",
        "SETOR1": "Compras",
        "EMAIL1": "alfa@example.com",
        "ID_PESSOA_TIPO": 1,
        "TIPO_PESSOA": "PESSOA FÍSICA",
        "RAZAO_SOCIAL": "FORNECEDOR DOC API 001 ALFA LTDA",
        "CNPJ": "12345678000190",
        "INSC_ESTADUAL": null,
        "INSC_MUNICIPAL": null,
        "NOME_FANTASIA": "ALFA DISTRIBUIDORA",
        "DATA_CNPJ": "2020-01-31T03:00:00.000Z",
        "NOME_RESPONSAVEL": null,
        "CARGO": null,
        "CPF": null,
        "RG": null,
        "CEP": "01001000",
        "ENDERECO": "Rua das Industrias",
        "ENDERECO_NUMERO": "100",
        "COMPLEMENTO": "Galpao 2",
        "BAIRRO": "Centro",
        "CIDADE": "Sao Paulo",
        "UF": "SP",
        "REGIAO_PAIS": null,
        "PAIS": "Brasil",
        "COD_MUNICIPIO": 3550308,
        "COD_UF": 35,
        "WEBSITE": "https://alfa.example.com",
        "FACEBOOK": null,
        "TWITTER": null,
        "FRETADOR": null,
        "INATIVO": 0,
        "DT_ULTIMA_COMPRA": null,
        "DATADOCADASTRO": "2026-11-16T17:42:28.000Z",
        "DT_UPDATE": "2026-11-16T03:00:00.000Z",
        "ANOTACOES": "Fornecedor criado para documentacao do endpoint."
      }
    ]
  },
  "quantity": 1,
  "errorId": 0,
  "info1": ""
}
```

## 4. `POST /supplier/v2/fornecedor-product-find-id`

### Requisição

```json
{
  "PE_PASSKEY": "example-passkey",
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

### Resposta

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

> O fornecedor `36961` é um registro pré-existente de desenvolvimento. O filtro por `PE_ID_PRODUTO` foi escolhido para limitar a evidência a dois registros.

## 5. `POST /supplier/v2/fornecedor-update`

### Requisição

```json
{
  "PE_PASSKEY": "example-passkey",
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "USER001",
  "PE_ID_FORNECEDOR": 36974,
  "PE_ID_CATEGORIA": 0,
  "PE_ID_TIPO": 0,
  "PE_NOME": "FORNECEDOR DOC API 001 ALFA",
  "PE_FISIJURI": "J",
  "PE_FONE1": "11999990001",
  "PE_WHATAPP1": "11999990001",
  "PE_CONTATO1": "Carlos Almeida",
  "PE_SETOR1": "Compras",
  "PE_EMAIL1": "alfa@example.com",
  "PE_RAZAO_SOCIAL": "FORNECEDOR DOC API 001 ALFA LTDA",
  "PE_CNPJ": "12345678000190",
  "PE_NOME_FANTASIA": "ALFA DISTRIBUIDORA ATUALIZADA",
  "PE_DATA_CNPJ": "2020-01-31",
  "PE_ATIVIDADE_PRINCIPAL": "Comercio atacadista de materiais de construcao e ferragens",
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
  "PE_WEBSITE": "https://alfa.example.com",
  "PE_ANOTACOES": "Fornecedor atualizado para documentacao do endpoint."
}
```

### Resposta

```json
{
  "statusCode": 100200,
  "message": "Fornecedor atualizado com sucesso.",
  "recordId": "36974",
  "data": [],
  "quantity": 1,
  "errorId": 0,
  "info1": ""
}
```

Verificação em `tbl_fornecedor` após a chamada:

```text
ID_FORNECEDOR  NOME                          NOME_FANTASIA                   ANOTACOES                                              DT_UPDATE
36974          FORNECEDOR DOC API 001 ALFA   ALFA DISTRIBUIDORA ATUALIZADA   Fornecedor atualizado para documentacao do endpoint.   2026-11-16
```

## 6. `POST /supplier/v2/fornecedor-delete`

### Requisição

```json
{
  "PE_PASSKEY": "example-passkey",
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": "USER001",
  "PE_ID_FORNECEDOR": 36975
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

A mesma resposta foi obtida ao excluir `36974`. A consulta final confirmou `0` fornecedores restantes com esses IDs.

## Evidências de erro

### 401 sem autenticação

```json
{
  "message": "API key is required",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 400 - campo obrigatório ausente

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

### 400 - campo desconhecido

```json
{
  "message": [
    "property PE_WHATSAPP1 should not exist"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

### 100422 - campo inexistente na atualização de campo

```json
{
  "statusCode": 100422,
  "message": "Erro! Campo \"CAMPO_INEXISTENTE\" não existe na tabela tbl_fornecedor",
  "recordId": 0,
  "data": [
    {
      "sp_return_id": 0,
      "sp_message": "Erro! Campo \"CAMPO_INEXISTENTE\" não existe na tabela tbl_fornecedor",
      "sp_error_id": 1
    }
  ],
  "quantity": 1,
  "errorId": 1
}
```

### Consulta sem registro

```json
{
  "statusCode": 100200,
  "message": "Supplier find manager Id not found",
  "recordId": "0",
  "data": {
    "Supplier find manager Id": []
  },
  "quantity": 0,
  "errorId": 0,
  "info1": ""
}
```

### Exclusão sem registro afetado

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

## Observações

- Todos os endpoints `POST` do controller foram exercitados.
- Nenhuma API key foi registrada neste relatório.
- `fornecedor-product-find-id` foi validado com dados pré-existentes de desenvolvimento porque a consulta não possui coluna de tenant e não havia vínculo criado para os fornecedores de teste.
- Os fornecedores de teste criados para a evidência (`36974`, `36975`) foram removidos ao final pela própria rota `fornecedor-delete`.
