# Endpoint API Reference - Consultar Fornecedor por ID (Manager)

### Descrição

Endpoint para consultar um único fornecedor pelo `ID_FORNECEDOR`, restrito ao cliente do sistema (`PE_ID_SYSTEM`) e à loja (`PE_ID_LOJA`). Retorna o registro completo usado pela tela de gestão, incluindo o campo calculado `TIPO_PESSOA`.

## Informações do Endpoint

| Item | Valor |
| --- | --- |
| Método | `POST` |
| Path | `/supplier/v2/supplier-find-manager-id` |
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
| `PE_ID_SYSTEM` | number | Sim | ID do cliente do sistema (tenant) | Número não vazio; usado no filtro `ID_SYSTEM_CLIENTE` |
| `PE_ID_LOJA` | number | Sim | ID da loja | Número não vazio; usado no filtro `ID_LOJA` |
| `PE_ID_DEPARTAMENTO` | number | Sim | ID do departamento | Número não vazio |
| `PE_ID_USUARIO` | string | Sim | ID do usuário | Texto não vazio |
| `pe_app_id` | number | Sim | ID da aplicação | Número não vazio |
| `pe_organization_id` | string | Sim | ID da organização | Texto não vazio |
| `pe_user_name` | string | Sim | Nome do usuário | Texto não vazio |
| `pe_user_role` | string | Sim | Papel do usuário | Texto não vazio |
| `pe_person_id` | number | Não | ID da pessoa associada | Número, quando informado |
| `pe_supplier_id` | number | Sim | ID do fornecedor consultado | Número não vazio; usado no filtro `ID_FORNECEDOR` |

> A consulta aplica `LIMIT 1`, portanto retorna no máximo um registro.

### Exemplo de Requisição

```http
POST /supplier/v2/supplier-find-manager-id
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
  "PE_ID_USUARIO": "USER001",
  "pe_user_name": "John Doe",
  "pe_user_role": "admin",
  "pe_person_id": 29014,
  "pe_supplier_id": 36974
}
```

## Estrutura da Resposta

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `statusCode` | number | Código interno de resposta (`100200` em caso de sucesso) |
| `message` | string | Mensagem de feedback |
| `recordId` | string | `"1"` quando há registro e `"0"` quando não há |
| `data` | object | Objeto com a chave `Supplier find manager Id`, contendo o array de fornecedores |
| `quantity` | number | Quantidade de registros retornados |
| `errorId` | number | `0` em caso de sucesso |
| `info1` | string | Informação complementar (vazia nesta operação) |

Campos de cada registro em `data["Supplier find manager Id"]`:

| Campo | Tipo | Descrição |
| --- | --- | --- |
| `ID_FORNECEDOR` | number | ID do fornecedor |
| `NOME` | string | Nome do fornecedor |
| `FISIJURI` | string | Tipo de pessoa (`J`/`F`) |
| `PATH_IMAGEM` | string | Caminho da imagem |
| `FONE1` | string | Telefone principal |
| `WHATAPP1` | string | WhatsApp (grafia histórica) |
| `CONTATO1` | string | Contato principal |
| `SETOR1` | string | Setor principal |
| `EMAIL1` | string | E-mail principal |
| `ID_PESSOA_TIPO` | number | ID do tipo de pessoa (`1` = pessoa física, demais = pessoa jurídica) |
| `TIPO_PESSOA` | string | Descrição calculada: `PESSOA FÍSICA` ou `PESSOA JURÍDICA` |
| `RAZAO_SOCIAL` | string | Razão social |
| `CNPJ` | string | CNPJ |
| `INSC_ESTADUAL`, `INSC_MUNICIPAL` | string | Inscrições estadual e municipal |
| `NOME_FANTASIA` | string | Nome fantasia |
| `DATA_CNPJ` | string (ISO 8601) | Data do CNPJ |
| `NOME_RESPONSAVEL` | string | Nome do responsável |
| `CARGO` | string | Cargo |
| `CPF`, `RG` | string | Documentos |
| `CEP`, `ENDERECO`, `ENDERECO_NUMERO`, `COMPLEMENTO`, `BAIRRO`, `CIDADE`, `UF`, `REGIAO_PAIS`, `PAIS` | string | Endereço |
| `COD_MUNICIPIO`, `COD_UF` | number | Códigos de município e UF |
| `WEBSITE`, `FACEBOOK`, `TWITTER` | string | Contatos digitais |
| `FRETADOR` | number | Indicador de freteiro |
| `INATIVO` | number | Indicador de inatividade |
| `DT_ULTIMA_COMPRA` | string (ISO 8601) | Data da última compra |
| `DATADOCADASTRO` | string (ISO 8601) | Data do cadastro |
| `DT_UPDATE` | string (ISO 8601) | Data da última atualização |
| `ANOTACOES` | string | Observações |

### Exemplo de Sucesso (201)

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

### Fornecedor não encontrado

Quando o fornecedor não existe para o tenant e a loja informados, a requisição continua retornando HTTP `201`, mas com o array vazio e a mensagem de não encontrado:

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

## Respostas de Erro

### 400 Bad Request (Erro de Validação)

Por exemplo, ao omitir `PE_ID_USUARIO`:

```json
{
  "message": [
    "ID do usuário é obrigatório.",
    "ID do usuário deve ser um texto."
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

```json
{
  "statusCode": 100404,
  "message": "Não foi possível concluir a operação de fornecedor.",
  "recordId": "",
  "data": []
}
```
