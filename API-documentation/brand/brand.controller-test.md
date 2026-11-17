# Relatório de testes HTTP - `src/brand/brand.controller.ts`

## Objetivo

Registrar as evidências reais utilizadas na documentação dos endpoints `POST` do `BrandController`.

## Ambiente

| Item | Valor |
| --- | --- |
| Data da execução | 2026-11-17 |
| Ambiente | desenvolvimento (`APP_ENVIRONMENT` de desenvolvimento) |
| Banco | MariaDB 11.4.13, schema de desenvolvimento (`database01`) |
| API | `http://localhost:5577/api` (`APP_PORT`) |
| Autenticação | `Authorization: Bearer {API_KEY}` lida do `.env` (valor não registrado) |
| Tenant usado | `PE_ID_SYSTEM` = `1`, `PE_ID_LOJA` = `1` |
| Marcas de teste criadas | `523` (`MARCA DOC API 001 ALFA`) e `524` (`MARCA DOC API 002 BETA`) |
| Marca criada e excluída no teste | `525` (`MARCA DOC API 003 GAMA`) |
| Massa remanescente | as marcas `523` e `524` permanecem ativas no banco de desenvolvimento |

## Resumo

| # | Endpoint | HTTP | `statusCode` | `errorId` | Resultado |
| --- | --- | --- | --- | --- | --- |
| 1 | `/brand/v2/marca-create` | 201 | 100200 | 0 | `recordId` `"523"` |
| 2 | `/brand/v2/marca-create` | 201 | 100200 | 0 | `recordId` `"524"` |
| 3 | `/brand/v2/marca-find-all` | 201 | 100200 | 0 | 2 registros |
| 4 | `/brand/v2/marca-AddComboBox` | 201 | 100200 | 0 | 12 registros |
| 5 | `/brand/v2/marca-update` | 201 | 100200 | 0 | 1 linha afetada (523) |
| 6 | `/brand/v2/marca-create` | 201 | 100200 | 0 | `recordId` `"525"` |
| 7 | `/brand/v2/marca-delete` | 201 | 100200 | 0 | 1 linha afetada (525) |

Testes de erro executados:

| Cenário | HTTP | `statusCode` | Resultado |
| --- | --- | --- | --- |
| Sem header de autenticação | 401 | — | `API key is required` |
| `marca-find-all` sem `PE_ID_DEPARTAMENTO` e `PE_ID_USUARIO` | 400 | — | erro do `ValidationPipe` |
| `marca-find-all` com `PE_PASSKEY` no corpo | 400 | — | `property PE_PASSKEY should not exist` |
| `marca-create` com `PE_NOME` de 2 caracteres | 400 | — | `PE_NOME must be longer than or equal to 5 characters` |
| `marca-delete` com marca inexistente (`999999`) | 201 | 100422 | `Nenhuma marca foi alterada.` (`errorId` 206) |
| `marca-update` com marca inexistente (`999999`) | 201 | 100422 | `Nenhuma marca foi alterada.` (`errorId` 206) |

## 1. `POST /brand/v2/marca-create`

### Requisição (`523`)

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_NOME": "MARCA DOC API 001 ALFA",
  "PE_PASTA_IMG": "/imagens/doc-api/marca-alfa.png",
  "PE_ANOTACOES": "Marca criada para documentacao do endpoint."
}
```

### Resposta

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

A marca `524` (`MARCA DOC API 002 BETA`) foi criada com o mesmo fluxo e retornou `recordId` `"524"`.

## 2. `POST /brand/v2/marca-find-all`

### Requisição

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

### Resposta

Retornou `quantity` 2, com `MARCA DOC API 001 ALFA` (`523`) e `MARCA DOC API 002 BETA` (`524`). O JSON completo está em `API-documentation/brand/marca-find-all.md`.

O filtro por nome é aplicado com `LIKE` sem wildcards automáticos: para busca parcial é necessário enviar `%` no valor, como no exemplo acima.

Consulta sem resultado (`PE_MARCA` `"MARCA QUE NAO EXISTE"`) retornou HTTP 201, `statusCode` 100200, `message` `"Nenhuma marca encontrada."`, `recordId` `"0"`, `data` `{"Marca FindAll":[]}` e `quantity` 0.

## 3. `POST /brand/v2/marca-AddComboBox`

### Requisição

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_MARCA": 0
}
```

### Resposta

Retornou `quantity` 12, com todas as marcas ativas do tenant `1` em ordem alfabética, incluindo as marcas de teste `523` e `524`. O JSON com dois registros de exemplo está em `API-documentation/brand/marca-add-combo-box.md`.

## 4. `POST /brand/v2/marca-update`

### Requisição

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

### Resposta

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

## 5. `POST /brand/v2/marca-delete`

### Requisição

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_ID_MARCA": 525
}
```

### Resposta

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

A exclusão é física (`DELETE`) e limitada ao tenant e ao `ID_MARCA` informados.

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
    "ID do departamento é obrigatório.",
    "ID do departamento deve ser um número.",
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
  "message": "Nenhuma marca foi alterada.",
  "recordId": "0",
  "data": [],
  "quantity": 0,
  "errorId": 206
}
```
