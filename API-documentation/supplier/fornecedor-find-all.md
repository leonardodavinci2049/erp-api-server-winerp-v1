# Endpoint API Reference - Consultar Fornecedores

### Descrição

Endpoint para consultar os fornecedores cadastrados para o cliente do sistema (`PE_ID_SYSTEM`), com filtro opcional por parte do nome. A resposta é entregue no result set `Supplier find all`, mantendo os nomes de coluna originais do contrato DataSnap.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v1/fornecedor-find-all` |
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

Todos os campos da tabela são obrigatórios e rejeitam `null`. Textos vazios (`""`) são aceitos. Para consultar sem filtro de nome, envie `PE_FORNECEDOR: ""`.

| Campo | Tipo | Obrigatório | Descrição | Restrições |
| --- | --- | --- | --- | --- |
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número maior ou igual a 1 (`@Min(1)`); filtro `ID_SYSTEM_CLIENTE` |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número; aceito pelo DTO, mas **não** usado como filtro nesta consulta |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_ID_USUARIO` | number | Sim | ID do usuário | Número; aceito pelo DTO, mas **não** usado na consulta |
| `PE_FORNECEDOR` | string | Sim | Trecho do nome do fornecedor | O filtro `NOME LIKE %valor%` só é aplicado quando o texto tem mais de 2 caracteres |

### Exemplo de Requisição

```http
POST /supplier/v1/fornecedor-find-all
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "PE_ID_SYSTEM": 1,
  "PE_ID_LOJA": 1,
  "PE_ID_DEPARTAMENTO": 1,
  "PE_ID_USUARIO": 1,
  "PE_FORNECEDOR": "DOC API"
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | `"Dados carregados com sucesso."` quando há registros ou `"Nenhum fornecedor encontrado."` quando a consulta retorna vazio |
| `recordId` | string | `"1"` quando há registros e `"0"` quando a consulta retorna vazio |
| `data` | object | Objeto com a chave `Supplier find all`, contendo o array de fornecedores |
| `quantity` | number | Quantidade de registros retornados |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

Campos de cada registro em `data["Supplier find all"]`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ID_FORNECEDOR` | number | ID do fornecedor |
| `ID_LOJA` | number | ID da loja |
| `ID_USUARIO` | number | ID do usuário |
| `ID_DEPARTAMENTO` | number | ID do departamento |
| `ID_SYSTEM_CLIENTE` | number | ID do cliente do sistema (tenant) |
| `ID_CATEGORIA`, `ID_TIPO`, `ID_IMAGEM` | number | Identificadores auxiliares |
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
        "ID_FORNECEDOR": 36976,
        "ID_LOJA": 1,
        "ID_USUARIO": 1,
        "ID_DEPARTAMENTO": 1,
        "ID_SYSTEM_CLIENTE": 1,
        "ID_CATEGORIA": 0,
        "ID_TIPO": 0,
        "ID_IMAGEM": 0,
        "NOME": "FORNECEDOR DOC API 001 ALFA",
        "FISIJURI": "J",
        "FONE1": "1133334444",
        "FONE2": null,
        "WHATAPP1": "11999990001",
        "WHATAPP2": null,
        "CONTATO1": "Carlos Almeida",
        "CONTATO2": null,
        "SETOR1": "Compras",
        "SETOR2": null,
        "EMAIL1": "alfa.docapi@example.com",
        "EMAIL2": null,
        "RAZAO_SOCIAL": "FORNECEDOR DOC API 001 ALFA LTDA",
        "CNPJ": "12345678000190",
        "INSC_ESTADUAL": null,
        "INSC_MUNICIPAL": null,
        "NOME_FANTASIA": "ALFA DISTRIBUIDORA ATUALIZADA",
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
        "WEBSITE": "https://alfa.docapi.example.com",
        "SKYPE": null,
        "MSN": "",
        "FACEBOOK": null,
        "TWITTER": null,
        "FRETADOR": null,
        "FLAG_FABRICANTE": 0,
        "DT_ULTIMA_COMPRA": null,
        "DT_UPDATE": "2026-11-17T03:00:00.000Z",
        "DATADOCADASTRO": "2026-11-17T11:42:44.000Z",
        "ANOTACOES": "Fornecedor atualizado para documentacao do endpoint."
      },
      {
        "ID_FORNECEDOR": 36977,
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
        "EMAIL1": "beta.docapi@example.com",
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
        "DT_UPDATE": "2026-11-17T03:00:00.000Z",
        "DATADOCADASTRO": "2026-11-17T11:42:44.000Z",
        "ANOTACOES": "Segundo fornecedor de teste da documentacao."
      }
    ]
  },
  "quantity": 2,
  "errorId": 0,
  "info1": ""
}
```

Quando nenhum fornecedor atende ao filtro, o retorno mantém `statusCode` `100200`, `message` `"Nenhum fornecedor encontrado."`, `recordId` `"0"`, `data` com o array vazio e `quantity` `0`.

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Ocorre quando qualquer campo está ausente ou é enviado como `null` ou um campo desconhecido é enviado. O exemplo abaixo omite `PE_ID_USUARIO`:

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

### 404 Erro de Negócio (Exemplo)

Ocorre quando a consulta falha no banco de dados. O HTTP permanece `201`, com o erro representado no envelope:

```json
{
  "statusCode": 100404,
  "message": "Não foi possível consultar os fornecedores.",
  "recordId": "",
  "data": []
}
```
