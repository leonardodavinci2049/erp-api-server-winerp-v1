# AGENTS.md — srvapi01

## Project

Multi-tenant B2B REST API: NestJS 11, TypeScript (`nodenext`, `strict: false` but `strictNullChecks: true` — avoid introducing new `any`), MySQL/MariaDB via raw SQL + Stored Procedures over `mysql2`, **no ORM**. Package manager: `pnpm`. Trust `package.json`, `biome.json`, `tsconfig.json`, and code over `README.md` (parts are stale, e.g. it mentions ESLint/Prettier; the repo uses Biome).

Nested instruction files supplement/override this one — read the closest `AGENTS.md` first (e.g. `src/brand/AGENTS.md`).

## Main technologies and dependencies

- **NestJS v11.1.28** (`@nestjs/common`, `@nestjs/core`) for the REST API framework and application lifecycle.
- **NestJS Platform Express v11.1.28** (`@nestjs/platform-express`) for the HTTP server adapter.
- **NestJS Config v4.0.4** (`@nestjs/config`) for environment and application configuration.
- **NestJS Swagger v11.4.6** (`@nestjs/swagger`) for OpenAPI documentation.
- **NestJS Throttler v6.5.0** (`@nestjs/throttler`) for request rate limiting.
- **MySQL2 v3.23.2** (`mysql2`) for local DB access through the singleton pool in `DatabaseService`.
- **Zod v4.4.3** (`zod`) for runtime validation of environment variables and application data.
- **Biome v2.5.6** (`@biomejs/biome`) for linting and formatting.
- **TypeScript v6.0.3** (`typescript`) for static typing and compilation.

## Build and Development Commands

All scripts wrap through `dotenv -e .env` — **never** run `next` directly.

The port used by the project when running `pnpm dev` is defined by the `APP_PORT` environment variable.

```bash
pnpm install
pnpm run dev              # nest start --watch; port from APP_PORT in .env
pnpm run build            # compile + type checking; there is NO separate typecheck script
pnpm run lint:check       # Biome lint (pnpm run lint writes fixes)
pnpm run format:check     # Biome format (pnpm run format writes)

```

- Prefer `:check` variants; use write modes only on task-scope files and review the diff.
- `dev`, tests, and HTTP checks require a valid `.env` (usually a reachable DB); don't confuse environment failure with code failure.
- The project currently does not work with tests — don't require test runs as part of task verification. Prefer `pnpm run build`, Biome checks, and authenticated HTTP tests against the development database to validate changes.

## Git workflow

- The project follows **git flow**.
- The base branch is `develop` — never work on `main`.
- For every new task that results in file changes, create a feature branch from a clean, up-to-date `develop` before editing files.
- If the user provides a branch name or task number, use it when it is compatible with the `feature/` prefix (for example, `feature/featr-NNN`).
- If the user does not provide a branch name or task number, do not stop only to ask for one. Derive a concise, descriptive kebab-case name from the task and create `feature/<task-slug>` (for example, `feature/use-manager-create-services`).
- Analysis-only work, continuation of an existing feature, or an explicit user instruction to work on the current branch are exceptions to automatic branch creation.
- If `develop` has uncommitted changes from previous work, do not stash, move, discard, or include them in a new feature. Ask the user to commit or otherwise resolve them before creating the branch.
- Do not merge, finish, delete, or push branches without explicit user authorization.
- The source of truth for project versioning is the `"version"` property in `package.json` (e.g. `"version": "1.1.2"`). The patch value must be incremented on each release and assigned to the release name, e.g. `release/1.8.0`, `hotfix/1.8.1`.

## Before committing

1. `pnpm lint` (Biome check — will auto-organize imports)
2. `pnpm build` (catches type errors — no separate typecheck command)

## Environment

Variables are Zod-validated at boot in `src/core/config/envs.ts` (fails fast): `APP_API_URL`, `APP_SWAGGER_URL`, `APP_JWT_SECRET`, `APP_PORT`, `API_KEY`, `DATABASE_HOST/PORT/USER/PASSWORD/NAME`. `.env` is gitignored and machine-local. Never expose its values in commands, logs, docs, or reports.

### Directory and fluxo map

```text
HTTP request -> controller -> service -> query -> DatabaseService
                                |           |
                                v           v
                         result helpers  MySQL/MariaDB

HTTP POST /api/<feature>/v2/<action>
  -> Controller (@UseGuards(AuthGuard), DTO validation)
  -> Service (orchestration, error handling, ResultModel)
  -> Query (pure function returning queryString + queryParams)
  -> DatabaseService (mysql2 pool)
```

- Feature module layout: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`, `query/`, `types/`, plus `entities/` when adopted. Register new modules in `src/app.main/app.module.ts`; import `DatabaseModule` where `DatabaseService` is used.
- Controllers hold HTTP/DTO concerns only — no SQL or business rules.
- Imports: absolute `src/...` for shared code; relative within a module.
- Global in `src/main.ts`: prefix `/api`, `ValidationPipe` with `whitelist`/`forbidNonWhitelisted`/`transform`/implicit conversion, CORS; `ThrottlerGuard` global. Do not weaken auth, validation, or rate limiting without documented impact analysis.

## Database & Stored Procedures

- All access via `src/database/database.service.ts`: `selectQuery`/`selectExecute` (reads), `ModifyExecute`/`ModifyQuery` (mutations), `runInTransaction` (atomic multi-step, rollback + connection release).
- Queries always use `?` placeholders — never concatenate or interpolate DTO data into SQL. Legacy interpolated queries exist: don't copy them or migrate them beyond the requested scope.
- Every tenant-bound operation must preserve `pe_system_client_id` and `pe_store_id`; never remove tenant filters.
- SP definitions live in the `stored-procedures` symlink to `/home/leomer/projects/mercury-projects/erp-database-sql-procedures/stored-procedures`. Before changing/exposing a procedure, verify signature, parameter order, and result sets there.
- Row interfaces extend `RowDataPacket` (mysql2); keep `as unknown as ...` casts at the mysql2 boundary; multi-result-set SPs need explicit tuples.
- Reuse processors from `src/core/process-result/`, the `ResultModel` envelope, and `RESPONSE_CODES`/`MESSAGES` from `src/core/utils/constants/globalConstants.ts` — no new response formats, no magic codes.
- No `DROP`, `TRUNCATE`, mass deletion, destructive DDL, or data corrections without explicit authorization; show target and expected impact before any DB write.

## HTTP contracts

- Auth: `Authorization: Bearer <API_KEY>` or `x-api-key` header. All business routes are `POST` with JSON bodies validated by `class-validator` DTOs that match the real contract.
- Preserve field names, types, codes, messages, and result-set shape for existing consumers. Never return raw DB errors, SQL with data, credentials, or stack traces.

## Verification

Proportional to risk: Biome checks on changed files, then as applicable `pnpm run build`, `pnpm run test`, `git diff --check`. Distinguish static checks, unit/E2E tests, and authenticated HTTP tests against the dev DB. If a check fails from a pre-existing issue or unavailable environment, record the command and limitation; don't modify unrelated files to make it pass. Review the task diff before finishing; confirm no secrets leaked.

## Important Constraints

- The default development language is US English. Code comments, error messages, documentation, and file names should use English.
- User-facing messages, labels, and interface text: Brazilian Portuguese (Brazilian audience).
- A closer `AGENTS.md`/`AGENTS.override.md` may supplement or override these rules; read the most specific instructions first.

## Communication and Delivery

- After completing a task, suggest one to three related follow-up tasks that represent the natural next steps. Do not execute these additional tasks without my authorization.
