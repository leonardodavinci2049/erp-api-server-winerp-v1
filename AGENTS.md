# AGENTS.md — erp-api-server-winerp-v1

## Project

Multi-tenant B2B REST API (internal name `WSERPADMIN`): NestJS 12, TypeScript (`nodenext` + ESM via `"type": "module"`, `strict: true` with `strictPropertyInitialization: false`), MySQL/MariaDB via raw SQL + Stored Procedures over `mysql2`, **no ORM**. Package manager: `pnpm`. Trust `package.json`, `tsconfig.json`, `.oxlintrc.json`, `.prettierrc`, and code over `README.md` — it is the stock NestJS starter and is stale (e.g. it documents a `start:dev` script that was renamed to `dev`).

Nested instruction files supplement/override this one — read the closest `AGENTS.md` first (e.g. `src/brand/AGENTS.md`, written in Brazilian Portuguese).

## Main technologies and dependencies

`package.json` is the source of truth for versions (major families listed below).

- **NestJS v12** (`@nestjs/common`, `@nestjs/core`, `@nestjs/platform-express`) for the REST API framework and application lifecycle.
- **NestJS Config v12** (`@nestjs/config`) for environment loading — `ConfigModule.forRoot({ isGlobal: true })` in `app.module.ts`.
- **NestJS Serve Static v12** (`@nestjs/serve-static`) to serve the static page in `pageroot/` at the root; routes under `/api` are excluded.
- **NestJS Throttler v6** (`@nestjs/throttler`) for request rate limiting — `ThrottlerModule` + `ThrottlerGuard` registered as `APP_GUARD` in `src/app.main/app.module.ts`.
- **MySQL2** (`mysql2`) for DB access through the singleton pool in `DbConnectionService`.
- **Zod v4** (`zod`) for boot-time validation of environment variables.
- **class-validator / class-transformer** for DTO validation on all business routes.
- **oxlint** (`.oxlintrc.json`, run with `--type-aware`) for linting and **prettier** (`.prettierrc`) for formatting. There is no ESLint and no Biome in this project.
- **vitest v4** for unit (`.spec.ts`) and e2e (`.e2e-spec.ts`) tests.
- **TypeScript v6** for static typing and compilation.

## Build and Development Commands

There is no CLI dotenv wrapper: `.env` is loaded in code (`import 'dotenv/config'` at the top of `src/core/config/envs.ts`) and validated at boot. Running `pnpm dev` or any DB-dependent check requires a valid `.env` in the project root.

The port used by the project is defined by the `APP_PORT` environment variable (falls back to `3000` in `src/main.ts`).

```bash
pnpm install
pnpm run dev              # nest start --watch
pnpm run build            # nest build — compile + type checking; there is NO separate typecheck script
pnpm run lint             # oxlint --type-aware src/ test/ (read-only)
pnpm run format           # prettier --write (writes fixes)
pnpm run test             # vitest run — unit tests (**/*.spec.ts)
pnpm run test:e2e         # vitest run --config vitest.config.e2e.ts (**/*.e2e-spec.ts)
pnpm run test:cov         # vitest run --coverage
```

- There are no `:check` script variants. `lint` is read-only; `format` writes — restrict it to task-scope files and review the diff.
- Unit tests mock `mysql2` and `envs`, so they run without a reachable database. E2E tests and authenticated HTTP checks need a valid `.env` (usually a reachable DB) — don't confuse environment failure with code failure.
- Shared helper scripts (git-flow release, schema generation, docs) live in the `scripts/` symlink to `erp-base-project/scripts`.

## Git workflow

- The project follows **git flow**.
- The base branch is `develop` — never work on `main`.
- For every new task that results in file changes, create a feature branch from a clean, up-to-date `develop` before editing files.
- If the user provides a branch name or task number, use it when it is compatible with the `feature/` prefix (for example, `feature/featr-NNN`).
- If the user does not provide a branch name or task number, do not stop only to ask for one. Derive a concise, descriptive kebab-case name from the task and create `feature/<task-slug>` (for example, `feature/use-manager-create-services`).
- Analysis-only work, continuation of an existing feature, or an explicit user instruction to work on the current branch are exceptions to automatic branch creation.
- If `develop` has uncommitted changes from previous work, do not stash, move, discard, or include them in a new feature. Ask the user to commit or otherwise resolve them before creating the branch.
- Do not merge, finish, delete, or push branches without explicit user authorization.
- The source of truth for project versioning is the `"version"` property in `package.json`. The patch value must be incremented on each release and assigned to the release name, e.g. `release/1.8.0`, `hotfix/1.8.1`.

## Before committing

1. `pnpm run lint` (oxlint — read-only check)
2. `pnpm run build` (catches type errors — no separate typecheck command)
3. `pnpm run test` (vitest unit tests)

## Environment

Variables are Zod-validated at boot in `src/core/config/envs.ts` (fails fast): `APP_API_URL`, `APP_SWAGGER_URL`, `APP_JWT_SECRET`, `APP_PORT`, `API_KEY`, optional `REVALIDATE_SECRET`, `DATABASE_HOST/PORT/USER/PASSWORD/NAME`, plus pool tuning with defaults — `DATABASE_POOL_CONNECTION_LIMIT` (10), `DATABASE_POOL_QUEUE_LIMIT` (100), `DATABASE_CONNECT_TIMEOUT_MS` (10000). The pool limit applies per API process; queue limit `0` means unlimited. `connectTimeout` limits establishing a database connection, not queue wait or query execution. Size the aggregate pool across all API processes against MariaDB capacity. `.env` is gitignored and machine-local. Never expose its values in commands, logs, docs, or reports.

### Directory and flow map

```text
HTTP request -> controller -> service -> query -> DbConnectionService
                                |           |
                                v           v
                         result helpers  MySQL/MariaDB

HTTP POST /api/<feature>/v2/<action>
  -> Controller (@UseGuards(AuthGuard), DTO validation)
  -> Service (orchestration, error handling, ResultModel)
  -> Query (pure function that returns `{ queryString, queryParams }` with `?` placeholders)
  -> DbConnectionService (mysql2 pool)

GET / (outside /api) -> ServeStaticModule -> pageroot/
```

- Feature module layout: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `query/`, `types/`, plus `entities/` when adopted. Register new modules in the `imports` array of `src/app.main/app.module.ts`; import `DbConnectionModule` where `DbConnectionService` is used.
- Controllers hold HTTP/DTO concerns only — no SQL or business rules.
- Imports are relative with explicit `.js` extensions (`nodenext`/ESM). No path aliases are configured — do not use absolute `src/...` imports.
- Globals are split across two files: `src/main.ts` sets the global prefix `/api`, the `ValidationPipe` (`whitelist`/`forbidNonWhitelisted`/`transform`/implicit conversion), and CORS; `src/app.main/app.module.ts` registers `ConfigModule` (global), `ServeStaticModule` (`pageroot/`), and `ThrottlerModule` with `ThrottlerGuard` as `APP_GUARD`. Do not weaken auth, validation, or rate limiting without documented impact analysis.

## Database & Stored Procedures

- `DbConnectionService` creates one mysql2 pool, validates initial connectivity during Nest module initialization, exposes the pool/checked-out connections, and closes it in `onApplicationShutdown`, after the HTTP adapter has closed. Concurrent close requests share the same promise, including failures. `src/main.ts` enables shutdown hooks for process signals. SQL operations and transactions belong to `src/db-operation/db-operation.service.ts`: `selectQuery` (reads), `mutationQuery` (writes), `callProcedure`, and `runInTransaction` (atomic multi-step, rollback + connection release).
- All queries — raw SQL and `call sp_...(...)` — use `?` placeholders with a typed params array returned by the query function as `{ queryString, queryParams }`; never concatenate or interpolate DTO data into SQL strings. DTO validation is the first barrier; placeholders are the second. Coalesce optional DTO fields (`?? null`) so `undefined` never reaches mysql2.
- Every tenant-bound operation must preserve `pe_system_client_id` and `pe_store_id`; never remove tenant filters.
- Stored procedure definitions are **not maintained in this repo** — `stored-procedures/` is a local placeholder directory (currently empty). Before changing or exposing a procedure, verify its signature, parameter order, and result sets against the development database.
- Row interfaces extend `RowDataPacket` (mysql2); keep `as unknown as ...` casts at the mysql2 boundary; multi-result-set SPs need explicit tuples.
- Reuse processors from `src/core/process-result/`, the `ResultModel` envelope, and `RESPONSE_CODES`/`MESSAGES` from `src/core/utils/constants/globalConstants.ts` — no new response formats, no magic codes.
- No `DROP`, `TRUNCATE`, mass deletion, destructive DDL, or data corrections without explicit authorization; show target and expected impact before any DB write.

## HTTP contracts

- Auth: `Authorization: Bearer <API_KEY>` or `x-api-key` header (checked by `AuthGuard` in `src/core/guards/auth.guard.ts`). All business routes are `POST` with JSON bodies validated by `class-validator` DTOs that match the real contract.
- Preserve field names, types, codes, messages, and result-set shape for existing consumers. Never return raw DB errors, SQL with data, credentials, or stack traces.

## Verification

Proportional to risk: oxlint on changed files, then as applicable `pnpm run build`, `pnpm run test` (vitest, mocked DB), `pnpm run test:e2e`/authenticated HTTP tests against the dev DB, and `git diff --check`. Distinguish static checks, unit tests, e2e tests, and authenticated HTTP tests. If a check fails from a pre-existing issue or unavailable environment, record the command and limitation; don't modify unrelated files to make it pass. Review the task diff before finishing; confirm no secrets leaked.

## Important Constraints

- The default development language is US English. Code comments, error messages, documentation, and file names should use English.
- User-facing messages, labels, and interface text: Brazilian Portuguese (Brazilian audience).
- A closer `AGENTS.md`/`AGENTS.override.md` may supplement or override these rules; read the most specific instructions first.

## Communication and Delivery

- After completing a task, suggest one to three related follow-up tasks that represent the natural next steps. Do not execute these additional tasks without my authorization.
