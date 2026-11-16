---
name: generate-endpoint-documentation
description: Generate Markdown API documentation for NestJS controller methods decorated with @Post by combining controller routes, DTO validation metadata, test report evidence, and existing API-documentation examples.
---

# Generate Endpoint Documentation

## Overview

Use this skill to generate one Markdown API reference file for each NestJS controller method decorated with `@Post(...)`. Combine facts from the controller, DTOs, the endpoint test report, and the existing manual documentation examples.

Do not generate endpoint documentation while only creating or updating this skill. When invoked for a controller, create or update only the endpoint `.md` files and preserve the `*-test.md` evidence file.

## Inputs And Locations

1. Receive a controller path such as:

```text
src/physical_product/physical_product.controller.ts
```

2. Use the controller parent folder as the module name. For the example above, use `physical_product`.
3. Use or create the output folder:

```text
API-documentation/<module-name>/
```

4. Locate the evidence report:

```text
API-documentation/<module-name>/<controller-file-stem>-test.md
```

For the current repository case, use:

```text
Controller: src/physical_product/physical_product.controller.ts
Evidence: API-documentation/physical_product/physical_product.controller-test.md
Output: API-documentation/physical_product/
```

5. Read these style references before drafting files:

```text
API-documentation/documentation-example/taxonomy-rel-create.md
API-documentation/documentation-example/taxonomy-rel-delete.md
API-documentation/documentation-example/taxonomy-rel-produto-all.md
```

If a repository has `API-documentation/endpoints-taxonomy-rel/*.md`, use those as equivalent examples too.

## Workflow

1. Read the controller file.
2. Extract the controller base route from `@Controller(...)`.
3. Discover only methods decorated with `@Post(...)`. Ignore `@Get`, `@Put`, `@Patch`, `@Delete`, and methods without `@Post`.
4. For each `@Post` method, identify:
   - Method route from `@Post(...)`.
   - TypeScript method name.
   - DTO class used by `@Body()`, when present.
   - Whether `@UseGuards(AuthGuard)` is applied on the controller or method.
   - Service method called by the controller, when visible.
5. Resolve each DTO through the controller imports and read the DTO file.
6. Extract DTO body fields, types, validation decorators, `@ApiProperty` descriptions/examples, and optionality.
7. Read the evidence report `API-documentation/<module-name>/<controller-file-stem>-test.md`.
8. Match each controller endpoint to its evidence by method route, full endpoint path, method name, or curl block.
9. Generate or update one Markdown file per `@Post` endpoint in `API-documentation/<module-name>/`.
10. Report any `@Post` method that lacks matching evidence.

## File Naming

Use the final endpoint route in kebab-case, without the version segment when possible:

```ts
@Post('v2/physical-product-find-all')
```

Generate:

```text
API-documentation/<module-name>/physical-product-find-all.md
```

Do not include `v2` in the filename unless required to avoid a collision. Never overwrite the `*-test.md` file.

## Required Document Structure

Each generated Markdown file must contain these sections in this exact order:

```md
# Endpoint API Reference - <human title>

### Descrição

## Informações do Endpoint

## Url Base

## Autenticação

## Estrutura da Requisição (Body)

### Exemplo de Requisição

## Estrutura da Resposta

### Exemplo de Sucesso (200/201)

## Respostas de Erro
```

Use tables and fenced code blocks inside those sections following the manual examples.

## Content Rules

### Descrição

Write a short objective Portuguese description based on the endpoint name, controller method, DTO, and test response.

Example:

```md
Endpoint para consultar os produtos físicos de acordo com os filtros informados.
```

### Informações do Endpoint

Include a table with:

- `Método`: always `POST`.
- `Path`: route without host, preferably `/<controller-base>/v2/<method-route>`.
- `Auth`: use `Authorization: Bearer {API_KEY}` or `x-api-key: {API_KEY}` when `AuthGuard` is present.
- `Content-Type`: `application/json`.
- `Rate Limit`: `500 requisições por minuto`.

If evidence includes the global prefix `/api`, omit `/api` from `Path` when the examples do so. Keep `/api` only in URL examples when needed.

### Url Base

Use this standard text unless the user explicitly asks for another base URL:

```md
A URL base da API é definida pela variável de ambiente `API_BASE_URL`.
Exemplo: `http://localhost:3333/api`
```

Do not change this example just because the evidence report used a different local port.

### Autenticação

When `AuthGuard` is applied, document authentication as required:

```md
A autenticação é **obrigatória**. Utilize um dos seguintes headers:

- **Authorization**: `Bearer {seu_api_key}`
- **x-api-key**: `{seu_api_key}`

Se a chave for inválida ou ausente, a API retornará `401 Unauthorized`.
```

If no `AuthGuard` is present, state that authentication is not required or was not identified in the controller.

### Estrutura da Requisição (Body)

Create a table with:

- `Campo`
- `Tipo`
- `Obrigatório`
- `Descrição`
- `Restrições`

Derive required fields from DTO decorators:

- `@IsOptional`: `Não`.
- `@IsNotEmpty`, validation decorators without `@IsOptional`, or clear required DTO fields: `Sim`.

Derive restrictions from decorators such as `@MaxLength`, `@MinLength`, `@IsNumber`, `@IsString`, `@IsInt`, `@IsBoolean`, and `@IsDateString`.

Prefer descriptions from `@ApiProperty`. When absent, infer conservative Portuguese descriptions from field names. Use these standard descriptions for common fields:

| Campo | Descrição |
| --- | --- |
| `pe_app_id` | ID da aplicação |
| `pe_system_client_id` | ID do cliente do sistema |
| `pe_store_id` | ID da loja |
| `pe_organization_id` | ID da organização |
| `pe_user_id` | ID do usuário |
| `pe_user_name` | Nome do usuário |
| `pe_user_role` | Papel do usuário |
| `pe_person_id` | ID da pessoa associada |

### Exemplo de Requisição

Use the real request body from the evidence report when available. Include an HTTP block first:

```http
POST /<controller-base>/v2/<method-route>
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

Then include the JSON request body in a `json` block. If no evidence request exists, state that no tested request body was found and create a minimal DTO-based example only when necessary.

### Estrutura da Resposta

Document the standard response envelope when present:

- `statusCode`
- `message`
- `recordId`
- `data`
- `quantity`
- `errorId`
- `info1`, if present in evidence

When `data` contains a large object or array, describe it generically instead of listing dozens of fields unless the fields are important and readable.

### Exemplo de Sucesso

Use the real response from the evidence report, formatted as indented JSON. Use the real HTTP status in the heading:

- `### Exemplo de Sucesso (201)` for status 201.
- `### Exemplo de Sucesso (200)` for status 200.
- `### Exemplo de Sucesso (200/201)` only when the status is unclear.

### Respostas de Erro

Always include:

1. `400 Bad Request (Erro de Validação)`.
2. `401 Unauthorized`.
3. `404/422 Erro de Negócio (Exemplo)`.

For validation errors, create an example consistent with required DTO fields. For business errors, use real error evidence when available. Otherwise use:

```json
{
  "statusCode": 100422,
  "message": "Error! Não foi possível processar a solicitação.",
  "recordId": 0,
  "data": [],
  "quantity": 0,
  "errorId": 1
}
```

## Validation Before Finishing

Before final response, verify:

- The number of generated endpoint files equals the number of `@Post` methods.
- Every generated file has all required sections in the required order.
- Every documented endpoint exists in the controller.
- Request examples came from the evidence report when available.
- Response examples came from the evidence report when available.
- The `*-test.md` file was not overwritten.

Finish by listing created/updated files and naming any `@Post` methods without evidence.
