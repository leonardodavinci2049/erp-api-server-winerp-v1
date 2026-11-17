# Endpoint API Reference - Criar Marca

### Descrição

Endpoint para cadastrar uma nova marca para o cliente do sistema (`PE_ID_SYSTEM`). O `ID_MARCA` é gerado pelo `AUTO_INCREMENT` de `tbl_produto_marca` e devolvido em `recordId`. A marca é criada como ativa (`INATIVO = 0`).

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/brand/v1/marca-create` |
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
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); gravado em `ID_SYSTEM_CLIENTE` |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** é gravado nesta operação |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** é gravado nesta operação |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** é gravado nesta operação |
| `PE_NOME` | string | Sim | Nome da marca | `@IsString` e `@MinLength(5)`. O texto `null` é removido do valor antes da gravação |
| `PE_PASTA_IMG` | string | Sim | Caminho/pasta da imagem da marca | `@IsString`; gravado na coluna `PATH_IMAGEM`. O texto `null` é removido |
| `PE_ANOTACOES` | string | Sim | Observações da marca | `@IsString`; o texto `null` é removido |

> `DATADOCADASTRO` é preenchida pelo banco com `CURRENT_TIMESTAMP`. Envie string vazia nos campos de texto opcionais do ponto de vista de negócio para gravar `''`.

### Exemplo de Requisição

```http
POST /brand/v1/marca-create
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

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

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Operação de marca concluída com sucesso."` |
| `recordId` | string | `insertId` gerado para a nova marca |
| `data` | array | Sempre vazio nesta operação |
| `quantity` | number | Quantidade de linhas afetadas (`1`) |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

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

Ocorre quando um campo obrigatório está ausente, um campo desconhecido é enviado ou `PE_NOME` tem menos de 5 caracteres:

```json
{
  "message": [
    "PE_NOME must be longer than or equal to 5 characters"
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

Ocorre quando o `INSERT` falha no banco de dados. O HTTP permanece `201`, com o erro representado no envelope:

```json
{
  "statusCode": 100404,
  "message": "Não foi possível criar a marca.",
  "recordId": "",
  "data": []
}
```

### 422 Erro de Negócio (Exemplo)

Caso nenhuma linha seja afetada, o envelope usa `errorId` 206:

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
