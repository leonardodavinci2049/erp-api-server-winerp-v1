# Endpoint API Reference - Consultar Fornecedores

### Descrição

Endpoint para consultar os fornecedores cadastrados para o cliente do sistema (`PE_ID_SYSTEM`) informado, com filtro opcional por parte do nome. A resposta traz os registros no result set `Supplier find all`, mantendo os nomes de coluna originais do contrato DataSnap.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v2/fornecedor-find-all` |
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
| `PE_PASSKEY` | string | Sim | Passkey de autenticação do contexto | Texto não vazio (`@IsString`, `@IsNotEmpty`) |
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`) |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número não vazio; aceito pelo DTO, mas **não** usado como filtro nesta consulta |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número não vazio |
| `PE_ID_USUARIO` | string | Sim | ID do usuário | Texto não vazio |
| `PE_FORNECEDOR` | string | Não | Trecho do nome do fornecedor | O filtro `LIKE %valor%` só é aplicado quando o texto tem mais de 2 caracteres |

### Exemplo de Requisição

```http
POST /supplier/v2/fornecedor-find-all
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

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

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | Mensagem de feedback |
| `recordId` | string | `"1"` quando há registros e `"0"` quando a consulta retorna vazio |
| `data` | object | Objeto com a chave `Supplier find all`, contendo o array de fornecedores |
| `quantity` | number | Quantidade de registros retornados |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

Campos principais de cada registro em `data["Supplier find all"]`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ID_FORNECEDOR` | number | ID do fornecedor |
| `ID_LOJA` | number | ID da loja |
| `ID_USUARIO` | number | ID do usuário |
| `ID_DEPARTAMENTO` | number | ID do departamento |
| `ID_SYSTEM_CLIENTE` | number | ID do cliente do sistema (tenant) |
| `ID_CATEGORIA` | number | ID da categoria |
| `ID_TIPO` | number | ID do tipo |
| `ID_IMAGEM` | number | ID da imagem |
| `NOME` | string | Nome do fornecedor |
| `FISIJURI` | string | Tipo de pessoa (`J`/`F`) |
| `FONE1`, `FONE2` | string | Telefones |
| `WHATAPP1`, `WHATAPP2` | string | WhatsApp (grafia histórica do contrato) |
| `CONTATO1`, `CONTATO2` | string | Contatos |
| `SETOR1`, `SETOR2` | string | Setores |
| `EMAIL1`, `EMAIL2` | string | E-mails |
| `RAZAO_SOCIAL` | string | Razão social |
| `CNPJ` | string | CNPJ |
| `INSC_ESTADUAL`, `INSC_MUNICIPAL` | string | Inscrições estadual e municipal |
| `NOME_FANTASIA` | string | Nome fantasia |
| `DATA_CNPJ` | string (ISO 8601) | Data do CNPJ |
| `NOME_RESPONSAVEL` | string | Nome do responsável |
| `CARGO_RESPOSNAVEL` | string | Cargo do responsável (grafia histórica) |
| `ATIVIDADE_PRINCIPAL`, `ATIVIDADES_SECUNDARIA1..5` | string | Atividades |
| `NATUREZA_JURIDICA`, `OBJETIVO_MISSAO`, `MISSAO_VISAO` | string | Dados institucionais |
| `PRIMEIRO_NOME`, `CARGO` | string | Dados da pessoa |
| `CPF`, `RG`, `GENERO`, `SOBRENOME`, `NOME_DO_MEIO` | string | Documentos e dados pessoais |
| `TRATAMENTO`, `TRABALHANAEMPRESA`, `FORMACAOACADEMICA`, `FORMACAOATUAL`, `ESPECIALIZACAO`, `INSTITUICAODEENSINO`, `CONJUGUE` | string | Dados complementares |
| `DATADONASCIMENTO` | string (ISO 8601) | Data de nascimento |
| `CEP`, `ENDERECO`, `ENDERECO_NUMERO`, `COMPLEMENTO`, `BAIRRO`, `CIDADE`, `UF`, `REGIAO_PAIS`, `PAIS` | string | Endereço |
| `COD_MUNICIPIO`, `COD_UF` | number | Códigos de município e UF |
| `WEBSITE`, `SKYPE`, `FACEBOOK`, `TWITTER` | string | Contatos digitais |
| `FRETADOR` | number | Indicador de freteiro |
| `DT_ULTIMA_COMPRA` | string (ISO 8601) | Data da última compra |
| `DT_UPDATE` | string (ISO 8601) | Data da última atualização |
| `DATADOCADASTRO` | string (ISO 8601) | Data do cadastro |
| `ANOTACOES` | string | Observações |

> Campos de compatibilidade preenchidos com valor fixo pela consulta: `ID_PESSOA`, `ID_EMPRESA`, `ID_TABELA`, `ID_RESPONSAVEL` (`0`), `TABELA`, `PATH_IMAGEM01`, `PATH_IMAGEM02`, `GOOGLEPLUS`, `MSN` (`""`), `FLAG_ENDERECO`, `FLAG_FABRICANTE` (`0`).

### Exemplo de Sucesso (201)

```json
{
  "statusCode": 100200,
  "message": "Dados carregados com sucesso.",
  "recordId": "1",
  "data": {
    "Supplier find all": [
      {
        "ID_FORNECEDOR": 36974,
        "ID_LOJA": 1,
        "ID_USUARIO": 1,
        "ID_DEPARTAMENTO": 1,
        "ID_SYSTEM_CLIENTE": 1,
        "ID_CATEGORIA": 0,
        "ID_TIPO": 0,
        "ID_IMAGEM": 0,
        "NOME": "FORNECEDOR DOC API 001 ALFA",
        "FISIJURI": "J",
        "FONE1": "11999990001",
        "FONE2": null,
        "WHATAPP1": "11999990001",
        "WHATAPP2": null,
        "CONTATO1": "Carlos Almeida",
        "CONTATO2": null,
        "SETOR1": "Compras",
        "SETOR2": null,
        "EMAIL1": "alfa@example.com",
        "EMAIL2": null,
        "RAZAO_SOCIAL": "FORNECEDOR DOC API 001 ALFA LTDA",
        "CNPJ": "12345678000190",
        "INSC_ESTADUAL": null,
        "INSC_MUNICIPAL": null,
        "NOME_FANTASIA": "ALFA DISTRIBUIDORA",
        "DATA_CNPJ": "2020-01-31T03:00:00.000Z",
        "NOME_RESPONSAVEL": null,
        "CARGO_RESPOSNAVEL": null,
        "ATIVIDADE_PRINCIPAL": "Comercio atacadista de materiais de construcao",
        "ATIVIDADES_SECUNDARIA1": null,
        "ATIVIDADES_SECUNDARIA2": null,
        "ATIVIDADES_SECUNDARIA3": null,
        "ATIVIDADES_SECUNDARIA4": null,
        "ATIVIDADES_SECUNDARIA5": null,
        "NATUREZA_JURIDICA": null,
        "OBJETIVO_MISSAO": null,
        "MISSAO_VISAO": null,
        "PRIMEIRO_NOME": null,
        "CARGO": null,
        "ID_PESSOA": 0,
        "ID_EMPRESA": 0,
        "ID_TABELA": 0,
        "ID_RESPONSAVEL": 0,
        "TABELA": "",
        "PATH_IMAGEM01": "",
        "PATH_IMAGEM02": "",
        "GOOGLEPLUS": "",
        "CPF": null,
        "RG": null,
        "GENERO": null,
        "SOBRENOME": null,
        "NOME_DO_MEIO": null,
        "TRATAMENTO": null,
        "TRABALHANAEMPRESA": null,
        "FORMACAOACADEMICA": null,
        "FORMACAOATUAL": null,
        "ESPECIALIZACAO": null,
        "INSTITUICAODEENSINO": null,
        "CONJUGUE": null,
        "DATADONASCIMENTO": null,
        "CEP": "01001000",
        "ENDERECO": "Rua das Industrias",
        "ENDERECO_NUMERO": "100",
        "COMPLEMENTO": "Galpao 2",
        "BAIRRO": "Centro",
        "CIDADE": "Sao Paulo",
        "UF": "SP",
        "REGIAO_PAIS": null,
        "PAIS": "Brasil",
        "FLAG_ENDERECO": 0,
        "COD_MUNICIPIO": 3550308,
        "COD_UF": 35,
        "WEBSITE": "https://alfa.example.com",
        "SKYPE": null,
        "MSN": "",
        "FACEBOOK": null,
        "TWITTER": null,
        "FRETADOR": null,
        "FLAG_FABRICANTE": 0,
        "DT_ULTIMA_COMPRA": null,
        "DT_UPDATE": "2026-11-16T03:00:00.000Z",
        "DATADOCADASTRO": "2026-11-16T17:42:28.000Z",
        "ANOTACOES": "Fornecedor criado para documentacao do endpoint."
      },
      {
        "ID_FORNECEDOR": 36975,
        "ID_LOJA": 1,
        "ID_USUARIO": 1,
        "ID_DEPARTAMENTO": 1,
        "ID_SYSTEM_CLIENTE": 1,
        "ID_CATEGORIA": 0,
        "ID_TIPO": 0,
        "ID_IMAGEM": 0,
        "NOME": "FORNECEDOR DOC API 002 BETA",
        "FISIJURI": "J",
        "FONE1": "11999990002",
        "FONE2": null,
        "WHATAPP1": "11999990002",
        "WHATAPP2": null,
        "CONTATO1": "Marina Souza",
        "CONTATO2": null,
        "SETOR1": "Comercial",
        "SETOR2": null,
        "EMAIL1": "beta@example.com",
        "EMAIL2": null,
        "RAZAO_SOCIAL": "FORNECEDOR DOC API 002 BETA LTDA",
        "CNPJ": "98765432000110",
        "INSC_ESTADUAL": null,
        "INSC_MUNICIPAL": null,
        "NOME_FANTASIA": "BETA ATACADO",
        "DATA_CNPJ": "2021-05-15T03:00:00.000Z",
        "NOME_RESPONSAVEL": null,
        "CARGO_RESPOSNAVEL": null,
        "ATIVIDADE_PRINCIPAL": null,
        "ATIVIDADES_SECUNDARIA1": null,
        "ATIVIDADES_SECUNDARIA2": null,
        "ATIVIDADES_SECUNDARIA3": null,
        "ATIVIDADES_SECUNDARIA4": null,
        "ATIVIDADES_SECUNDARIA5": null,
        "NATUREZA_JURIDICA": null,
        "OBJETIVO_MISSAO": null,
        "MISSAO_VISAO": null,
        "PRIMEIRO_NOME": null,
        "CARGO": null,
        "ID_PESSOA": 0,
        "ID_EMPRESA": 0,
        "ID_TABELA": 0,
        "ID_RESPONSAVEL": 0,
        "TABELA": "",
        "PATH_IMAGEM01": "",
        "PATH_IMAGEM02": "",
        "GOOGLEPLUS": "",
        "CPF": null,
        "RG": null,
        "GENERO": null,
        "SOBRENOME": null,
        "NOME_DO_MEIO": null,
        "TRATAMENTO": null,
        "TRABALHANAEMPRESA": null,
        "FORMACAOACADEMICA": null,
        "FORMACAOATUAL": null,
        "ESPECIALIZACAO": null,
        "INSTITUICAODEENSINO": null,
        "CONJUGUE": null,
        "DATADONASCIMENTO": null,
        "CEP": null,
        "ENDERECO": null,
        "ENDERECO_NUMERO": null,
        "COMPLEMENTO": null,
        "BAIRRO": null,
        "CIDADE": "Campinas",
        "UF": "SP",
        "REGIAO_PAIS": null,
        "PAIS": "Brasil",
        "FLAG_ENDERECO": 0,
        "COD_MUNICIPIO": 0,
        "COD_UF": 0,
        "WEBSITE": null,
        "SKYPE": null,
        "MSN": "",
        "FACEBOOK": null,
        "TWITTER": null,
        "FRETADOR": null,
        "FLAG_FABRICANTE": 0,
        "DT_ULTIMA_COMPRA": null,
        "DT_UPDATE": "2026-11-16T03:00:00.000Z",
        "DATADOCADASTRO": "2026-11-16T17:42:34.000Z",
        "ANOTACOES": "Segundo fornecedor de teste da documentacao."
      }
    ]
  },
  "quantity": 2,
  "errorId": 0,
  "info1": ""
}
```

Quando não há fornecedores para o filtro, o retorno mantém `statusCode` `100200`, `message` `"Nenhum fornecedor encontrado."`, `recordId` `"0"`, `data` com o array vazio e `quantity` `0`.

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando um campo obrigatório do contexto está ausente ou um campo desconhecido é enviado.

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

### 401 Unauthorized

```json
{
  "message": "API key is required",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 422 Erro de Negócio (Exemplo)

Ocorre quando a consulta falha no banco de dados.

```json
{
  "statusCode": 100404,
  "message": "Não foi possível consultar os fornecedores.",
  "recordId": "",
  "data": []
}
```
