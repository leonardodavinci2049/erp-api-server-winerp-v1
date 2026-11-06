# AGENTS.md — erp-api-server-winerp-v1

## Projeto

API REST B2B multi-tenant (nome interno `erp-api-server-winerp-v1`): NestJS 12, TypeScript (`nodenext` + ESM via `"type": "module"`, `strict: true` com `strictPropertyInitialization: false`), MySQL/MariaDB via SQL puro + Stored Procedures sobre `mysql2`, **sem ORM**. Gerenciador de pacotes: `pnpm`. Confie em `package.json`, `tsconfig.json`, `.oxlintrc.json`, `.prettierrc` e no código em vez do `README.md` — ele é o starter padrão do NestJS e está desatualizado (por exemplo, documenta um script `start:dev` que foi renomeado para `dev`).

Arquivos de instrução aninhados complementam ou substituem este — leia o `AGENTS.md` mais próximo primeiro (por exemplo, `src/brand/AGENTS.md`, escrito em português do Brasil).

## Principais tecnologias e dependências

`package.json` é a fonte da verdade para as versões (principais famílias listadas abaixo).

- **NestJS v12** (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`) para o framework da API REST e o ciclo de vida da aplicação.
- **NestJS Config v12** (`@nestjs/config`) para carregamento de ambiente — `ConfigModule.forRoot({ isGlobal: true })` em `app.module.ts`.
- **NestJS Serve Static v12** (`@nestjs/serve-static`) para servir a página estática em `pageroot/` na raiz; rotas sob `/api` são excluídas.
- **NestJS Throttler v6** (`@nestjs/throttler`) para limitação de taxa de requisições — `ThrottlerModule` + `ThrottlerGuard` registrados como `APP_GUARD` em `src/app.main/app.module.ts`.
- **MySQL2** (`mysql2`) para acesso ao banco por meio do pool singleton em `DbConnectionService`.
- **Zod v4** (`zod`) para validação das variáveis de ambiente na inicialização.
- **class-validator / class-transformer** para validação de DTO em todas as rotas de negócio.
- **oxlint** (`.oxlintrc.json`, executado com `--type-aware`) para lint e **prettier** (`.prettierrc`) para formatação. Não há ESLint nem Biome neste projeto.
- **vitest v4** para testes unitários (`.spec.ts`) e e2e (`.e2e-spec.ts`).
- **TypeScript v6** para tipagem estática e compilação.

## Comandos de build e desenvolvimento

Não há wrapper de dotenv na CLI: o `.env` é carregado no código (`import 'dotenv/config'` no topo de `src/core/config/envs.ts`) e validado na inicialização. Executar `pnpm dev` ou qualquer verificação dependente do banco exige um `.env` válido na raiz do projeto.

A porta usada pelo projeto é definida pela variável de ambiente `APP_PORT` (recorre a `3000` em `src/main.ts`).

```bash
pnpm install
pnpm run dev              # nest start --watch
pnpm run build            # nest build — compila + verifica tipos; NÃO existe script separado de typecheck
pnpm run lint             # oxlint --type-aware src/ test/ (somente leitura)
pnpm run format           # prettier --write (escreve correções)
pnpm run test             # vitest run — testes unitários (**/*.spec.ts)
pnpm run test:e2e         # vitest run --config vitest.config.e2e.ts (**/*.e2e-spec.ts)
pnpm run test:cov         # vitest run --coverage
```

- Não existem variantes de script `:check`. `lint` é somente leitura; `format` escreve — restrinja-o aos arquivos do escopo da tarefa e revise o diff.
- Testes unitários fazem mock de `mysql2` e `envs`, então rodam sem banco acessível. Testes E2E e verificações HTTP autenticadas exigem um `.env` válido (geralmente um banco acessível) — não confunda falha de ambiente com falha de código.
- Scripts auxiliares compartilhados (release git-flow, geração de schema, docs) ficam no symlink `scripts/` para `erp-base-project/scripts`.

## Fluxo de trabalho Git

- O projeto segue **git flow**.
- A branch base é `develop` — nunca trabalhe em `main`.
- Para cada nova tarefa que resulte em alterações de arquivos, crie uma branch de feature a partir de uma `develop` limpa e atualizada antes de editar arquivos.
- Se o usuário fornecer um nome de branch ou número de tarefa, use-o quando for compatível com o prefixo `feature/` (por exemplo, `feature/featr-NNN`).
- Se o usuário não fornecer nome de branch nem número de tarefa, não pare apenas para perguntar. Derive um nome kebab-case conciso e descritivo da tarefa e crie `feature/<task-slug>` (por exemplo, `feature/use-manager-create-services`).
- Trabalho somente de análise, continuação de uma feature existente ou instrução explícita do usuário para trabalhar na branch atual são exceções à criação automática de branch.
- Se `develop` tiver alterações não commitadas de trabalho anterior, não faça stash, não mova, não descarte nem inclua em uma nova feature. Peça ao usuário para commitar ou resolver de outra forma antes de criar a branch.
- Não faça merge, finish, delete nem push de branches sem autorização explícita do usuário.
- A fonte da verdade para o versionamento do projeto é a propriedade `"version"` em `package.json`. O valor de patch deve ser incrementado a cada release e atribuído ao nome da release, por exemplo, `release/1.8.0`, `hotfix/1.8.1`.

## Antes de commitar

1. `pnpm run lint` (oxlint — verificação somente leitura)
2. `pnpm run build` (captura erros de tipo — não há comando separado de typecheck)
3. `pnpm run test` (testes unitários vitest)

## Ambiente

As variáveis são validadas com Zod na inicialização em `src/core/config/envs.ts` (falha rápida): `APP_API_URL`, `APP_SWAGGER_URL`, `APP_JWT_SECRET`, `APP_PORT`, `API_KEY`, `REVALIDATE_SECRET` opcional, `DATABASE_HOST/PORT/USER/PASSWORD/NAME`, além do ajuste fino do pool com padrões — `DATABASE_POOL_CONNECTION_LIMIT` (10), `DATABASE_POOL_QUEUE_LIMIT` (100), `DATABASE_CONNECT_TIMEOUT_MS` (10000). O limite do pool se aplica por processo da API; limite de fila `0` significa ilimitado. `connectTimeout` limita o estabelecimento de uma conexão com o banco, não a espera na fila nem a execução da consulta. Dimensione o pool agregado entre todos os processos da API conforme a capacidade do MariaDB. O `.env` é ignorado pelo git e local a cada máquina. Nunca exponha seus valores em comandos, logs, docs ou relatórios.

### Mapa de diretórios e fluxo

```text
requisição HTTP -> controller -> service -> query -> DbConnectionService
                                |           |
                                v           v
                     helpers de resultado  MySQL/MariaDB

HTTP POST /api/<feature>/v2/<action>
  -> Controller (@UseGuards(AuthGuard), validação de DTO)
  -> Service (orquestração, tratamento de erros, ResultModel)
  -> Query (função pura que retorna `{ queryString, queryParams }` com placeholders `?`)
  -> DbConnectionService (pool mysql2)

GET / (fora de /api) -> ServeStaticModule -> pageroot/
```

- Layout de módulo de feature: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `query/`, `types/`, mais `entities/` quando adotado. Registre novos módulos no array `imports` de `src/app.main/app.module.ts`; importe `DbConnectionModule` onde `DbConnectionService` for usado.
- Controllers cuidam apenas de preocupações HTTP/DTO — sem SQL nem regras de negócio.
- Imports são relativos com extensões `.js` explícitas (`nodenext`/ESM). Não há aliases de caminho configurados — não use imports absolutos `src/...`.
- Os globais estão divididos em dois arquivos: `src/main.ts` define o prefixo global `/api`, o `ValidationPipe` (`whitelist`/`forbidNonWhitelisted`/`transform`/conversão implícita) e o CORS; `src/app.main/app.module.ts` registra `ConfigModule` (global), `ServeStaticModule` (`pageroot/`) e `ThrottlerModule` com `ThrottlerGuard` como `APP_GUARD`. Não enfraqueça autenticação, validação ou rate limiting sem análise de impacto documentada.

## Banco de dados e Stored Procedures

- `DbConnectionService` cria um pool mysql2, valida a conectividade inicial durante a inicialização do módulo Nest, expõe o pool/conexões obtidas e o fecha em `onApplicationShutdown`, após o adapter HTTP ter fechado. Solicitações de fechamento concorrentes compartilham a mesma promise, incluindo falhas. `src/main.ts` habilita shutdown hooks para sinais de processo. Operações SQL pertencem a `src/db-operation/db-operation.service.ts`: `selectQuery` (leituras), `mutationQuery` (escritas) e `callProcedure`. Stored procedures controlam as transações.
- Todas as consultas — SQL puro e `call sp_...(...)` — usam placeholders `?` com um array de parâmetros tipado retornado pela função de query como `{ queryString, queryParams }`; nunca concatene ou interpole dados de DTO em strings SQL. A validação de DTO é a primeira barreira; os placeholders são a segunda. Faça coalescência dos campos opcionais do DTO (`?? null`) para que `undefined` nunca chegue ao mysql2.
- Toda operação vinculada a tenant deve preservar `pe_system_client_id` e `pe_store_id`; nunca remova filtros de tenant.
- As definições de stored procedure **não são mantidas neste repositório** — `stored-procedures/` é um diretório placeholder local (atualmente vazio). Antes de alterar ou expor um procedure, verifique sua assinatura, ordem dos parâmetros e result sets contra o banco de desenvolvimento.
- Interfaces de linha estendem `RowDataPacket` (mysql2); mantenha os casts `as unknown as ...` na fronteira do mysql2; SPs com múltiplos result sets precisam de tuplas explícitas.
- Reutilize os processors de `src/core/process-result/`, o envelope `ResultModel` e `RESPONSE_CODES`/`MESSAGES` de `src/core/utils/constants/globalConstants.ts` — sem novos formatos de resposta, sem códigos mágicos.
- Sem `DROP`, `TRUNCATE`, exclusão em massa, DDL destrutivo ou correções de dados sem autorização explícita; mostre o alvo e o impacto esperado antes de qualquer escrita no banco.

## Contratos HTTP

- Auth: header `Authorization: Bearer <API_KEY>` ou `x-api-key` (verificado pelo `AuthGuard` em `src/core/guards/auth.guard.ts`). Todas as rotas de negócio são `POST` com corpos JSON validados por DTOs `class-validator` que correspondem ao contrato real.
- Preserve nomes de campos, tipos, códigos, mensagens e o formato do result set para consumidores existentes. Nunca retorne erros brutos do banco, SQL com dados, credenciais ou stack traces.

## Verificação

Proporcional ao risco: oxlint nos arquivos alterados e, conforme aplicável, `pnpm run build`, `pnpm run test` (vitest, banco com mock), `pnpm run test:e2e`/testes HTTP autenticados contra o banco de dev, e `git diff --check`. Diferencie verificações estáticas, testes unitários, testes e2e e testes HTTP autenticados. Se uma verificação falhar por um problema pré-existente ou ambiente indisponível, registre o comando e a limitação; não modifique arquivos não relacionados para fazê-la passar. Revise o diff da tarefa antes de finalizar; confirme que nenhum segredo vazou.

## Restrições importantes

- O idioma padrão de desenvolvimento é inglês (EUA). Comentários de código, mensagens de erro,nomes de arquivo devem usar inglês.
- documentação , arquivos AGENTS e  README use o Português do Brasil.
- Mensagens voltadas ao usuário, labels e texto de interface: português do Brasil (público brasileiro).
- Um `AGENTS.md`/`AGENTS.override.md` mais próximo pode complementar ou substituir estas regras; leia as instruções mais específicas primeiro.

## Comunicação e entrega

- Após concluir uma tarefa, sugira de uma a três tarefas de acompanhamento relacionadas que representem os próximos passos naturais. Não execute essas tarefas adicionais sem minha autorização.
