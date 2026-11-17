# Endpoint API Reference - Atualizar Fornecedor

### Descrição

Endpoint para atualizar um fornecedor existente do cliente do sistema (`PE_ID_SYSTEM`). A operação é uma porta de `acceptFornecedorV1` (`UsvmFornecedor.pas`) e sobrescreve todas as colunas previstas no `UPDATE`; o cliente deve enviar o registro completo.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v1/fornecedor-update` |
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
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); compõe o `WHERE` junto com `PE_ID_FORNECEDOR` |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** usado no `UPDATE` |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** usado no `UPDATE` |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** usado no `UPDATE` |
| `PE_ID_FORNECEDOR` | number | Sim | ID do fornecedor a atualizar | `@IsNumber`; compõe o `WHERE` com `PE_ID_SYSTEM` |
| `PE_ID_CATEGORIA` | number | Não | ID da categoria | `@IsNumber`; quando ausente grava `0` |
| `PE_ID_TIPO` | number | Não | ID do tipo | `@IsNumber`; quando ausente grava `0` |
| `PE_NOME` | string | Não | Nome do fornecedor | `@IsString`; ao contrário da criação, não exige mínimo de 5 caracteres |
| `PE_FISIJURI` | string | Não | Tipo de pessoa (`J`/`F`) | `@IsString` |
| `PE_FONE1`, `PE_FONE2` | string | Não | Telefones | `@IsString` |
| `PE_WHATAPP1`, `PE_WHATAPP2` | string | Não | WhatsApp | `@IsString`; grafia do contrato legado |
| `PE_CONTATO1`, `PE_CONTATO2` | string | Não | Contatos | `@IsString` |
| `PE_SETOR1`, `PE_SETOR2` | string | Não | Setores | `@IsString` |
| `PE_EMAIL1`, `PE_EMAIL2` | string | Não | E-mails | `@IsString` |
| `PE_RAZAO_SOCIAL` | string | Não | Razão social | `@IsString` |
| `PE_CNPJ` | string | Não | CNPJ | `@IsString` |
| `PE_INSC_ESTADUAL`, `PE_INSC_MUNICIPAL` | string | Não | Inscrições | `@IsString` |
| `PE_NOME_FANTASIA` | string | Não | Nome fantasia | `@IsString` |
| `PE_DATA_CNPJ` | string | Não | Data do CNPJ | Aceita `YYYY-MM-DD` ou `DD/MM/YYYY`; valor vazio grava `NULL` |
| `PE_NOME_RESPONSAVEL` | string | Não | Nome do responsável | `@IsString` |
| `PE_CARGO_RESPOSNAVEL` | string | Não | Cargo do responsável | `@IsString`; grafia histórica |
| `PE_ATIVIDADE_PRINCIPAL` | string | Não | Atividade principal | `@IsString` |
| `PE_ATIVIDADES_SECUNDARIA1..5` | string | Não | Atividades secundárias | `@IsString` em cada campo |
| `PE_NATUREZA_JURIDICA` | string | Não | Natureza jurídica | `@IsString` |
| `PE_OBJETIVO_MISSAO` | string | Não | Objetivo/missão | `@IsString` |
| `PE_MISSAO_VISAO` | string | Não | Missão/visão | `@IsString` |
| `PE_PRIMEIRO_NOME`, `PE_CARGO` | string | Não | Dados da pessoa | `@IsString` |
| `PE_CPF`, `PE_RG`, `PE_GENERO`, `PE_SOBRENOME`, `PE_NOME_DO_MEIO` | string | Não | Documentos e dados pessoais | `@IsString` |
| `PE_TRATAMENTO`, `PE_TRABALHANAEMPRESA`, `PE_FORMACAOACADEMICA`, `PE_FORMACAOATUAL`, `PE_ESPECIALIZACAO`, `PE_INSTITUICAODEENSINO`, `PE_CONJUGUE` | string | Não | Dados complementares | `@IsString` |
| `PE_DATADONASCIMENTO` | string | Não | Data de nascimento | Aceita `YYYY-MM-DD` ou `DD/MM/YYYY`, mas **não faz parte do `UPDATE`**, como no legado |
| `PE_CEP`, `PE_ENDERECO`, `PE_ENDERECO_NUMERO`, `PE_COMPLEMENTO`, `PE_BAIRRO`, `PE_CIDADE`, `PE_UF`, `PE_REGIAO_PAIS`, `PE_PAIS` | string | Não | Endereço | `@IsString` |
| `PE_COD_MUNICIPIO`, `PE_COD_UF` | number | Não | Códigos IBGE | `@IsNumber`; quando ausentes gravam `0` |
| `PE_WEBSITE`, `PE_SKYPE`, `PE_FACEBOOK`, `PE_TWITTER` | string | Não | Contatos digitais | `@IsString` |
| `PE_ANOTACOES` | string | Não | Observações | `@IsString` |

> Campos de texto não enviados são gravados como `NULL` e os campos numéricos de categoria, tipo e códigos IBGE como `0`. `DT_UPDATE` recebe `CURRENT_TIMESTAMP` e `DATADOCADASTRO` é preservada.

### Exemplo de Requisição

```http
POST /supplier/v1/fornecedor-update
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

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

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Fornecedor atualizado com sucesso."` ou `"Nenhum fornecedor foi atualizado."` |
| `recordId` | string | `PE_ID_FORNECEDOR` informado quando houve atualização; `"0"` quando nenhuma linha foi afetada |
| `data` | array | Sempre vazio nesta operação |
| `quantity` | number | Quantidade de linhas afetadas |
| `errorId` | number | `0` em caso de sucesso; `206` quando nenhuma linha foi afetada |
| `info1` | string | Informação complementar (presente apenas em caso de sucesso) |

### Exemplo de Sucesso (201)

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

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando um campo obrigatório do contexto está ausente, um valor possui tipo inválido ou um campo desconhecido é enviado:

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

Retornado quando nenhuma linha corresponde a `PE_ID_SYSTEM` + `PE_ID_FORNECEDOR`:

```json
{
  "statusCode": 100422,
  "message": "Nenhum fornecedor foi atualizado.",
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
  "message": "Não foi possível atualizar o fornecedor.",
  "recordId": "",
  "data": []
}
```
