# Endpoint API Reference - Criar Fornecedor

### Descrição

Endpoint para criar um fornecedor em `tbl_fornecedor`. O `ID_FORNECEDOR` é gerado pelo `AUTO_INCREMENT` da tabela e devolvido em `recordId`. Valores textuais e datas não informados são gravados como `NULL`.

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

`PE_PASSKEY` não faz parte do corpo da requisição: a autenticação é feita exclusivamente pelos headers acima e o envio desse campo no JSON retorna `400 Bad Request` (`property PE_PASSKEY should not exist`).

## Estrutura da Requisição (Body)

| Campo | Tipo | Obrigatório | Descrição | Restrições |
| --- | --- | --- | --- | --- |
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant), gravado em `ID_SYSTEM_CLIENTE` | Número maior ou igual a 1 (`@Min(1)`) |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número não vazio; aceito no contexto, mas não gravado na criação (a coluna usa o default da tabela) |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número não vazio |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número |
| `PE_NOME` | string | Sim | Nome do fornecedor | Texto não vazio, mínimo de 5 caracteres |
| `PE_ID_CATEGORIA` | number | Não | ID da categoria | Número; ausente grava `0` |
| `PE_ID_TIPO` | number | Não | ID do tipo | Número; ausente grava `0` |
| `PE_FISIJURI` | string | Não | Tipo de pessoa (`J`/`F`) | Texto |
| `PE_FONE1`, `PE_FONE2` | string | Não | Telefones | Texto |
| `PE_WHATAPP1`, `PE_WHATAPP2` | string | Não | WhatsApp (grafia histórica) | Texto |
| `PE_CONTATO1`, `PE_CONTATO2` | string | Não | Contatos | Texto |
| `PE_SETOR1`, `PE_SETOR2` | string | Não | Setores | Texto |
| `PE_EMAIL1`, `PE_EMAIL2` | string | Não | E-mails | Texto |
| `PE_RAZAO_SOCIAL` | string | Não | Razão social | Texto |
| `PE_CNPJ` | string | Não | CNPJ | Texto |
| `PE_INSC_ESTADUAL`, `PE_INSC_MUNICIPAL` | string | Não | Inscrições estadual e municipal | Texto |
| `PE_NOME_FANTASIA` | string | Não | Nome fantasia | Texto |
| `PE_DATA_CNPJ` | string | Não | Data do CNPJ | Aceita `YYYY-MM-DD` ou `DD/MM/YYYY`; vazio grava `NULL` |
| `PE_NOME_RESPONSAVEL` | string | Não | Nome do responsável | Texto |
| `PE_CARGO_RESPOSNAVEL` | string | Não | Cargo do responsável (grafia histórica) | Texto |
| `PE_ATIVIDADE_PRINCIPAL` | string | Não | Atividade principal | Texto |
| `PE_ATIVIDADES_SECUNDARIA1..5` | string | Não | Atividades secundárias | Texto |
| `PE_NATUREZA_JURIDICA` | string | Não | Natureza jurídica | Texto |
| `PE_OBJETIVO_MISSAO` | string | Não | Objetivo/missão | Texto |
| `PE_MISSAO_VISAO` | string | Não | Missão/visão | Texto |
| `PE_PRIMEIRO_NOME` | string | Não | Primeiro nome | Texto |
| `PE_CARGO` | string | Não | Cargo | Texto |
| `PE_CPF`, `PE_RG` | string | Não | Documentos | Texto |
| `PE_GENERO` | string | Não | Gênero | Texto |
| `PE_SOBRENOME` | string | Não | Sobrenome | Texto |
| `PE_NOME_DO_MEIO` | string | Não | Nome do meio | Texto |
| `PE_TRATAMENTO` | string | Não | Tratamento | Texto |
| `PE_TRABALHANAEMPRESA` | string | Não | Trabalha na empresa | Texto |
| `PE_FORMACAOACADEMICA` | string | Não | Formação acadêmica | Texto |
| `PE_FORMACAOATUAL` | string | Não | Formação atual | Texto |
| `PE_ESPECIALIZACAO` | string | Não | Especialização | Texto |
| `PE_INSTITUICAODEENSINO` | string | Não | Instituição de ensino | Texto |
| `PE_CONJUGUE` | string | Não | Cônjuge | Texto |
| `PE_DATADONASCIMENTO` | string | Não | Data de nascimento | Aceita `YYYY-MM-DD` ou `DD/MM/YYYY`; vazio grava `NULL` |
| `PE_CEP`, `PE_ENDERECO`, `PE_ENDERECO_NUMERO`, `PE_COMPLEMENTO`, `PE_BAIRRO`, `PE_CIDADE`, `PE_UF`, `PE_REGIAO_PAIS`, `PE_PAIS` | string | Não | Endereço | Texto |
| `PE_COD_MUNICIPIO` | number | Não | Código do município | Número; ausente grava `0` |
| `PE_COD_UF` | number | Não | Código da UF | Número; ausente grava `0` |
| `PE_WEBSITE`, `PE_SKYPE`, `PE_FACEBOOK`, `PE_TWITTER` | string | Não | Contatos digitais | Texto |
| `PE_ANOTACOES` | string | Não | Observações | Texto |

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
  "PE_ID_DEPARTAMENTO": 0,
  "PE_ID_USUARIO": 1,
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

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | Mensagem de feedback |
| `recordId` | string | `ID_FORNECEDOR` gerado (`insertId`) |
| `data` | array | Vazio nesta operação |
| `quantity` | number | Quantidade de linhas afetadas |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

### Exemplo de Sucesso (201)

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

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando um campo obrigatório está ausente ou um campo desconhecido é enviado. O exemplo abaixo foi obtido enviando `PE_WHATSAPP1` (grafia incorreta) em vez de `PE_WHATAPP1`:

```json
{
  "message": [
    "property PE_WHATSAPP1 should not exist"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Também é retornado quando `PE_NOME` tem menos de 5 caracteres:

```json
{
  "message": [
    "PE_NOME deve ter no mínimo 5 caracteres."
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

Quando nenhuma linha é inserida:

```json
{
  "statusCode": 100200,
  "message": "Não foi possível criar o fornecedor.",
  "recordId": "0",
  "data": [],
  "quantity": 0,
  "errorId": 206,
  "info1": ""
}
```

Em falha de banco de dados:

```json
{
  "statusCode": 100404,
  "message": "Não foi possível criar o fornecedor.",
  "recordId": "",
  "data": []
}
```
