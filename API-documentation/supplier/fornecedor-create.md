# Endpoint API Reference - Criar Fornecedor

### Descrição

Endpoint para cadastrar um novo fornecedor para o cliente do sistema (`PE_ID_SYSTEM`). O `ID_FORNECEDOR` é gerado pelo `AUTO_INCREMENT` de `tbl_fornecedor` e devolvido em `recordId`. A operação é uma porta de `updateFornecedorV1` (`UsvmFornecedor.pas`).

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v2/fornecedor-create` |
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
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** é gravado (a coluna usa o default da tabela) |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** é gravado |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** é gravado |
| `PE_ID_CATEGORIA` | number | Não | ID da categoria | `@IsNumber`; quando ausente grava `0` |
| `PE_ID_TIPO` | number | Não | ID do tipo | `@IsNumber`; quando ausente grava `0` |
| `PE_FISIJURI` | string | Não | Tipo de pessoa (`J`/`F`) | `@IsString` |
| `PE_FONE1` | string | Não | Telefone principal | `@IsString` |
| `PE_FONE2` | string | Não | Telefone secundário | `@IsString` |
| `PE_WHATAPP1` | string | Não | WhatsApp principal | `@IsString`; a grafia `WHATAPP` é a do contrato legado |
| `PE_WHATAPP2` | string | Não | WhatsApp secundário | `@IsString` |
| `PE_CONTATO1` | string | Não | Contato principal | `@IsString` |
| `PE_CONTATO2` | string | Não | Contato secundário | `@IsString` |
| `PE_SETOR1` | string | Não | Setor principal | `@IsString` |
| `PE_SETOR2` | string | Não | Setor secundário | `@IsString` |
| `PE_EMAIL1` | string | Não | E-mail principal | `@IsString` |
| `PE_EMAIL2` | string | Não | E-mail secundário | `@IsString` |
| `PE_RAZAO_SOCIAL` | string | Não | Razão social | `@IsString` |
| `PE_CNPJ` | string | Não | CNPJ | `@IsString` |
| `PE_INSC_ESTADUAL` | string | Não | Inscrição estadual | `@IsString` |
| `PE_INSC_MUNICIPAL` | string | Não | Inscrição municipal | `@IsString` |
| `PE_NOME_FANTASIA` | string | Não | Nome fantasia | `@IsString` |
| `PE_DATA_CNPJ` | string | Não | Data do CNPJ | Aceita `YYYY-MM-DD` ou `DD/MM/YYYY`; valor vazio grava `NULL` |
| `PE_NOME_RESPONSAVEL` | string | Não | Nome do responsável | `@IsString` |
| `PE_CARGO_RESPOSNAVEL` | string | Não | Cargo do responsável | `@IsString`; grafia histórica `RESPOSNAVEL` |
| `PE_ATIVIDADE_PRINCIPAL` | string | Não | Atividade principal | `@IsString` |
| `PE_ATIVIDADES_SECUNDARIA1..5` | string | Não | Atividades secundárias | `@IsString` em cada campo |
| `PE_NATUREZA_JURIDICA` | string | Não | Natureza jurídica | `@IsString` |
| `PE_OBJETIVO_MISSAO` | string | Não | Objetivo/missão | `@IsString` |
| `PE_MISSAO_VISAO` | string | Não | Missão/visão | `@IsString` |
| `PE_PRIMEIRO_NOME` | string | Não | Primeiro nome da pessoa | `@IsString` |
| `PE_CARGO` | string | Não | Cargo da pessoa | `@IsString` |
| `PE_CPF` | string | Não | CPF | `@IsString` |
| `PE_RG` | string | Não | RG | `@IsString` |
| `PE_GENERO` | string | Não | Gênero | `@IsString` |
| `PE_SOBRENOME` | string | Não | Sobrenome | `@IsString` |
| `PE_NOME_DO_MEIO` | string | Não | Nome do meio | `@IsString` |
| `PE_TRATAMENTO` | string | Não | Tratamento | `@IsString` |
| `PE_TRABALHANAEMPRESA` | string | Não | Empresa onde trabalha | `@IsString` |
| `PE_FORMACAOACADEMICA` | string | Não | Formação acadêmica | `@IsString` |
| `PE_FORMACAOATUAL` | string | Não | Formação atual | `@IsString` |
| `PE_ESPECIALIZACAO` | string | Não | Especialização | `@IsString` |
| `PE_INSTITUICAODEENSINO` | string | Não | Instituição de ensino | `@IsString` |
| `PE_CONJUGUE` | string | Não | Cônjuge | `@IsString` |
| `PE_DATADONASCIMENTO` | string | Não | Data de nascimento | Aceita `YYYY-MM-DD` ou `DD/MM/YYYY`; valor vazio grava `NULL` |
| `PE_CEP` | string | Não | CEP | `@IsString` |
| `PE_ENDERECO` | string | Não | Endereço | `@IsString` |
| `PE_ENDERECO_NUMERO` | string | Não | Número do endereço | `@IsString` |
| `PE_COMPLEMENTO` | string | Não | Complemento | `@IsString` |
| `PE_BAIRRO` | string | Não | Bairro | `@IsString` |
| `PE_CIDADE` | string | Não | Cidade | `@IsString` |
| `PE_UF` | string | Não | UF | `@IsString` |
| `PE_REGIAO_PAIS` | string | Não | Região/país | `@IsString` |
| `PE_PAIS` | string | Não | País | `@IsString` |
| `PE_COD_MUNICIPIO` | number | Não | Código IBGE do município | `@IsNumber`; quando ausente grava `0` |
| `PE_COD_UF` | number | Não | Código IBGE da UF | `@IsNumber`; quando ausente grava `0` |
| `PE_WEBSITE` | string | Não | Website | `@IsString` |
| `PE_SKYPE` | string | Não | Skype | `@IsString` |
| `PE_FACEBOOK` | string | Não | Facebook | `@IsString` |
| `PE_TWITTER` | string | Não | Twitter | `@IsString` |
| `PE_ANOTACOES` | string | Não | Observações | `@IsString` |
| `PE_NOME` | string | Sim | Nome do fornecedor | `@IsNotEmpty` e `@MinLength(5)` |

> `DATADOCADASTRO` e `DT_UPDATE` são preenchidas pelo banco. Campos de texto ausentes são gravados como `NULL`, e não com a string `"null"` produzida pelo cliente legado.

### Exemplo de Requisição

```http
POST /supplier/v2/fornecedor-create
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

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

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Fornecedor criado com sucesso."` |
| `recordId` | string | `insertId` gerado para o novo fornecedor |
| `data` | array | Sempre vazio nesta operação |
| `quantity` | number | Quantidade de linhas afetadas (`1`) |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

### Exemplo de Sucesso (201)

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

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando `PE_NOME` tem menos de 5 caracteres, um campo obrigatório está ausente ou um campo desconhecido é enviado:

```json
{
  "message": [
    "PE_NOME deve ter no mínimo 5 caracteres."
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

```json
{
  "message": [
    "property PE_WHATSAPP1 should not exist"
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
  "message": "Não foi possível criar o fornecedor.",
  "recordId": "",
  "data": []
}
```

### 422 Erro de Negócio (Exemplo)

Caso nenhuma linha seja afetada, o envelope usa `errorId` 206:

```json
{
  "statusCode": 100422,
  "message": "Não foi possível criar o fornecedor.",
  "recordId": "0",
  "data": [],
  "quantity": 0,
  "errorId": 206
}
```
