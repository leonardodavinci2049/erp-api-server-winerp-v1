# Endpoint API Reference - Atualizar Campo do Fornecedor

### Descrição

Endpoint para atualizar um único campo do fornecedor, de forma genérica e tipada, executando a procedure `sp_supplier_upd_general_field_v2`. A procedure valida o campo contra o schema de `tbl_fornecedor`, grava o novo valor, atualiza `DT_UPDATE` e registra a operação no log de auditoria.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v2/supplier-upd-general-field` |
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

`PE_PASSKEY` não faz parte do corpo da requisição: a autenticação é feita exclusivamente pelos headers acima e o envio desse campo no JSON retorna `400 Bad Request` (`property PE_PASSKEY should not exist`).

## Estrutura da Requisição (Body)

| Campo | Tipo | Obrigatório | Descrição | Restrições |
| --- | --- | --- | --- | --- |
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número não vazio |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número não vazio; precisa coincidir com o `ID_LOJA` do fornecedor, pois a procedure bloqueia a linha por tenant + loja |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número não vazio |
| `PE_ID_USUARIO` | number | Sim | ID do usuário que executa a alteração | Número |
| `pe_app_id` | number | Sim | ID da aplicação | Número não vazio |
| `pe_organization_id` | string | Sim | ID da organização | Texto não vazio |
| `pe_user_name` | string | Sim | Nome do usuário | Texto não vazio |
| `pe_user_role` | string | Sim | Papel do usuário | Texto não vazio |
| `pe_person_id` | number | Não | ID da pessoa associada | Número, quando informado |
| `pe_register_id` | number | Sim | ID do fornecedor (`tbl_fornecedor.ID_FORNECEDOR`) | Número não vazio e maior ou igual a 1 |
| `pe_field_type` | number | Sim | Tipo do valor enviado | Aceita apenas `1` (string), `2` (bigint), `3` (decimal) ou `4` (date) |
| `pe_field` | string | Sim | Nome da coluna de `tbl_fornecedor` a atualizar | Apenas letras, números e underscore (`^[a-zA-Z0-9_]+$`); o campo precisa existir na tabela |
| `pe_value_str` | string | Não | Valor quando `pe_field_type` é `1` | Texto |
| `pe_value_int` | number | Não | Valor quando `pe_field_type` é `2` | Número inteiro |
| `pe_value_numeric` | number | Não | Valor quando `pe_field_type` é `3` | Número decimal |
| `pe_value_date` | string | Não | Valor quando `pe_field_type` é `4` | Data no formato `YYYY-MM-DD` |

> Apenas o valor correspondente ao `pe_field_type` é gravado; os demais são ignorados pela procedure. Valores ausentes são gravados como `NULL`.

### Exemplo de Requisição

```http
POST /supplier/v2/supplier-upd-general-field
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_ID_DEPARTAMENTO": 0,
  "pe_app_id": 1,
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "pe_organization_id": "ORG001",
  "PE_ID_USUARIO": 1,
  "pe_user_name": "John Doe",
  "pe_user_role": "admin",
  "pe_person_id": 29014,
  "pe_register_id": 36974,
  "pe_field_type": 1,
  "pe_field": "ATIVIDADE_PRINCIPAL",
  "pe_value_str": "Comercio atacadista de materiais de construcao e ferragens",
  "pe_value_int": null,
  "pe_value_numeric": null,
  "pe_value_date": null
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | `100200` em caso de sucesso; `100422` em erro de negócio da procedure |
| `message` | string | Mensagem de feedback da procedure |
| `recordId` | number | ID do fornecedor atualizado (`sp_return_id`) ou `0` em caso de erro |
| `data` | array | Array com o feedback da procedure (`sp_return_id`, `sp_message`, `sp_error_id`) |
| `quantity` | number | Quantidade de linhas de feedback |
| `errorId` | number | `0` em caso de sucesso; código do erro da procedure quando houver |
| `info1` | string | Informação complementar (vazia nesta operação) |

### Exemplo de Sucesso (201)

```json
{
  "statusCode": 100200,
  "message": "Cadastro atualizado com sucesso.",
  "recordId": 36974,
  "data": [
    {
      "sp_return_id": 36974,
      "sp_message": "Cadastro atualizado com sucesso.",
      "sp_error_id": 0
    }
  ],
  "quantity": 1,
  "errorId": 0,
  "info1": ""
}
```

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre, por exemplo, quando `pe_field_type` está fora do intervalo permitido ou `pe_field` contém caracteres inválidos.

```json
{
  "message": [
    "pe_field_type must be one of the following values: 1, 2, 3, 4",
    "pe_field must contain only letters, numbers and underscore"
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

### 422 Erro de Negócio (Exemplo)

Quando o campo informado não existe em `tbl_fornecedor`, a procedure retorna erro de negócio:

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

Outros erros de negócio previstos pela procedure, com o mesmo envelope:

| Situação | `message` |
| --- | --- |
| `PE_ID_SYSTEM` menor que 1 | `Erro! Informe um ID system` |
| `pe_register_id` menor que 1 | `Erro! Informe um ID do cliente` |
| `pe_field_type` fora de 1–4 | `Erro! PE_FIELD_TYPE inválido. Use: 1=string, 2=bigint, 3=decimal, 4=date` |
| `pe_field` vazio ou com menos de 2 caracteres | `Erro! Nome do campo (PE_FIELD) inválido` |
| `pe_field` com caracteres inválidos | `Erro! Nome do campo contém caracteres inválidos` |
| Fornecedor inexistente para tenant/loja | `Erro! Cadastro não encontrado na tabela tbl_fornecedor` |
| Nenhuma linha alterada | `Erro! Não foi possível atualizar o registro.` |
| Exceção SQL | `Erro ao atualizar o cadastro` |
