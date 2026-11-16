---
name: nextjs-security-auditor
description: Use para auditorias defensivas de seguranca em projetos Next.js 16 App Router/TypeScript, especialmente este app com better-auth, Server Actions, MySQL, axios server-side, Zod e integracoes externas. Gera relatorios em pt-BR com achados por severidade, evidencia, impacto e correcao sugerida, sem alterar codigo da aplicacao.
---

# Skill: Auditor de Seguranca Next.js

Voce e um auditor de seguranca defensiva analisando o codigo-fonte deste repositorio. Seu objetivo e encontrar falhas reais, classifica-las por severidade e gerar um relatorio acionavel em pt-BR.

## Quando usar esta skill

Use esta skill quando o usuario pedir:

- auditoria de seguranca
- diagnostico de vulnerabilidades
- revisao de autenticacao/autorizacao
- verificacao de exposicao de segredos
- analise de Server Actions, API routes, banco, envs, cache, headers, dependencias ou integracoes externas
- geracao de relatorio de seguranca do projeto
- revisao de seguranca antes de deploy

## Quando NAO usar

- Nao use para corrigir bugs funcionais ou de UI.
- Nao use para refatoracao geral.
- Nao use como substituto de `pnpm lint` ou `pnpm build`.

## Regras obrigatorias

1. **Nao altere codigo-fonte, configuracoes ou dependencias durante a auditoria.** A saida e apenas o relatorio.
2. **Nunca imprima valores reais de segredos, tokens, senhas ou chaves.** Mascare sempre (ex: `BETTER_AUTH_SECRET=***REDACTED***`).
3. **Nao rode `next` diretamente** nem `pnpm dev/build/start` durante a auditoria.
4. **Nao imprima o conteudo de `.env` inteiro.**
5. **Nao faca pentest ativo contra sistemas externos** sem autorizacao explicita do usuario.
6. **Nao execute scripts destrutivos.**
7. Audite apenas o repositorio atual, a menos que o usuario autorize outro alvo.

## Stack do projeto

| Tecnologia | Versao/Detalhe |
|---|---|
| Next.js | 16 App Router, React Compiler, cacheComponents |
| React | 19 |
| TypeScript | 6.x |
| Auth | better-auth com MySQL, OAuth (GitHub, Discord), admin plugin, Resend |
| Banco | MySQL via mysql2/promise (singleton DatabaseService) |
| HTTP client | axios server-only (`server-axios-client.ts` com `import "server-only"`) |
| Validacao | Zod 4 |
| CSS | Tailwind CSS v4 |
| Lint | Biome |
| Package manager | pnpm |
| Locale | pt-BR |

## Mapeamento do projeto

Antes de procurar vulnerabilidades, levante o contexto:

| Area | Caminho | O que procurar |
|---|---|---|
| Rotas autenticadas | `src/app/dashboard/` | Protecao de rota, middleware, layout auth |
| Paginas de auth | `src/app/(auth)/` | Sign-in, forgot/reset password, logout |
| Server Actions | `src/app/actions/` | Validacao de entrada, checagem de auth/role, IDOR |
| API route de auth | `src/app/api/auth/[...all]/route.ts` | Handler better-auth |
| Config de auth | `src/lib/auth/` | Sessao, cookies, OAuth, roles, rate limit |
| Permissoes | `src/lib/auth/permissions/admin-roles.ts` | Roles admin/user, statements |
| Env server | `src/core/config/envs.server.ts` | Segredos, `import "server-only"` |
| Env client | `src/core/config/envs.client.ts` | `NEXT_PUBLIC_*`, vazamento |
| Validacao env | `src/core/config/env-validation.ts` | Mensagens de erro com dados sensiveis |
| Cache config | `src/lib/cache-config.ts` | Tags, perfis, dados personalizados |
| Next config | `next.config.ts` | Headers, source maps, imagens, allowed IPs |
| Axios client | `src/lib/axios/server-axios-client.ts` | SSRF, headers, API key em log |
| Base API service | `src/lib/axios/base-api-service.ts` | Tratamento de erro, vazamento |
| DB connection | `src/database/dbConnection.ts` | Queries preparadas, log de queries, singleton |
| Services DB | `src/services/db/` (13 modulos) | SQL injection, parametros, auth checks |
| Services API | `src/services/api-main/` (23 modulos) | SSRF, validacao, dados sensiveis |
| CEP service | `src/services/api-cep/` | SSRF, dados de usuario |
| Assets service | `src/services/api-assets/` | Upload, path traversal |
| Biome config | `biome.json` | `noDangerouslySetInnerHtml: off` em UI components |

## Fases da auditoria

### Fase 1 - Confirmar escopo

- Confirme com o usuario o escopo (projeto inteiro, modulo especifico, ou area).
- Se o usuario pedir auditoria geral, cubra todas as 10 categorias abaixo.

### Fase 2 - Levantar contexto

- Use `rg --files`, `rg -n`, leituras pontuais e `find` para mapear pontos de entrada.
- Leia `AGENTS.md` para comandos e restricoes do projeto.
- Identifique fluxos de dados: entrada do usuario -> validacao -> acao sensivel -> resposta.

Comandos uteis para mapeamento:

```bash
rg --files src/app/actions/
rg --files src/services/db/
rg --files src/app/api/
rg -n "use server" src/app/actions/
rg -n "export async function" src/services/db/
```

### Fase 3 - Analisar cada categoria de risco

Siga o checklist em `references/checklist.md` para cada categoria. Priorize por impacto potencial.

### Fase 4 - Reduzir falsos positivos

Antes de reportar um achado, verifique:

- Ha um caminho de exploracao plausivel?
- A validacao no servidor compensa a falta no client?
- O React ja escapa o output por padrao? (Nao reportar XSS em JSX comum)
- O achado depende de pre-condicoes irrealistas?
- Compare com padroes seguros ja existentes no projeto.

Classifique cada achado:
- **Confirmado**: Evidencia concreta com caminho de exploracao
- **Investigar**: Suspeito, mas sem evidencia suficiente
- **Sem achado**: Area revisada sem problema concreto

### Fase 5 - Classificar severidade

| Nivel | Criterio |
|---|---|
| **Critico** | Vazamento de dados real, bypass de auth, RCE, segredo exposto, acesso admin indevido |
| **Alto** | IDOR, endpoint sensivel mal protegido, SSRF exploravel, SQL injection provavel, impacto relevante com pre-condicoes realistas |
| **Medio** | Erro verboso com dados sensiveis, cache compartilhado entre usuarios, risco real com impacto limitado |
| **Baixo** | Melhoria defensiva com impacto pequeno |
| **Informativo** | Observacao util sem vulnerabilidade demonstrada |

### Fase 6 - Gerar relatorio

1. Crie `docs/reports/` se nao existir.
2. Grave em `docs/reports/security-audit-YYYY-MM-DD.md`.
3. Se ja existir no mesmo dia, use sufixo incremental: `security-audit-YYYY-MM-DD-2.md`.
4. Use o template em `references/report-template.md`.

## Comandos seguros para auditoria

Use estes comandos durante a analise:

```bash
# Buscar APIs perigosas
rg -n "dangerouslySetInnerHTML|eval\(|new Function|innerHTML|localStorage|sessionStorage" src

# Buscar credenciais e segredos
rg -n "password|secret|token|api[_-]?key|authorization|cookie|set-cookie" src package.json next.config.ts

# Buscar queries SQL
rg -n "execute\(|query\(|SELECT|INSERT|UPDATE|DELETE|DROP" src/services src/app

# Buscar controles de auth
rg -n "auth|session|permission|role|admin|seller|userId|customerId|orderId" src

# Buscar envs publicas
rg -n "NEXT_PUBLIC_" src

# Verificar dependencias vulneraveis
pnpm audit

# Buscar import de server-only
rg -n "server-only" src

# Buscar use cache
rg -n "use cache|cacheTag|cacheLife" src

# Buscar tratamento de erro que pode vazar dados
rg -n "catch|error|Error|throw|console\.(log|error|warn)" src/services src/app/actions

# Buscar headers de seguranca
rg -n "headers|Content-Security-Policy|X-Frame-Options|Strict-Transport" src next.config.ts middleware.ts
```

## Categorias de risco detalhadas

### 1. Segredos e exposicao de credenciais

Procure:
- Chaves hardcoded em qualquer `.ts/.tsx/.js`
- `NEXT_PUBLIC_*` que deveria ser server-only (especialmente chaves, senhas, tokens)
- Valores de env impressos em logs, erros ou respostas HTTP
- Erro de validacao de env que revela nomes ou valores de variaveis sensiveis
- `console.log` ou `console.error` com dados sensiveis
- Segredos em `next.config.ts`, `package.json` ou outros arquivos versionados

**Falsos positivos comuns**: Nomes de env em `envs.server.ts` sao esperados (apenas as chaves, nao os valores). Nomes de chave em schemas Zod sao seguros.

### 2. Autenticacao e sessao

Procure:
- Rotas `src/app/dashboard/` sem verificacao de sessao no layout ou middleware
- Configuracao de sessao do better-auth: `expiresIn`, `updateAge`, `cookieCache`
- Callbacks OAuth sem verificacao de email
- Logout que nao invalida sessao no servidor
- Reset password com token fraco ou sem expiracao
- `requireEmailVerification: true` - verificar se e enforced em todas as rotas protegidas
- Rate limiting configurado (`rateLimit` no auth.ts)

Pontos de atencao especificos deste projeto:
- `src/lib/auth/auth.ts` tem `cookieCache: { maxAge: 300 }` (5 min) - verificar se mudancas de role/permissoes propagam
- OAuth providers suportados: GitHub e Discord (em `o-auth-providers.ts` referencia Discord, mas em `envs.server.ts` so ha GitHub e Google - **inconsistencia**)

### 3. Autorizacao e controle de acesso

Procure:
- Server Actions sem checagem de role/permissoes
- Services DB que recebem IDs do usuario diretamente sem verificar pertencimento
- IDOR: `userId`, `customerId`, `orderId`, `leadId` passados como parametro sem checagem
- Diferenca entre `role: "admin"` e `role: "user"` - o que cada um pode fazer?
- Endpoints que retornam dados de outros usuarios/organizacoes
- Em `src/services/db/` (13 modulos): verificar se cada query filtra por usuario/organizacao logada

Fluxo de dados critico:
1. Server Action recebe parametros do client
2. Deve verificar sessao + role
3. Deve validar que o recurso pertence ao usuario/organizacao
4. Somente entao executar a query

### 4. Validacao de entrada e injection

Procure:
- Queries SQL com concatenacao de string em vez de parametros preparados
- `dbService.selectQuery()` vs `dbService.selectExecute()` - o segundo usa prepared statements nativamente
- Validacao Zod ausente em Server Actions antes de operacoes sensiveis
- Path traversal em upload/download de assets
- SSRF: URLs construidas com input do usuario em `server-axios-client.ts`
- Command injection em scripts

Distincao importante neste projeto:
- `pool.query()` com params -> mysql2 faz escaping automatico
- `pool.execute()` com params -> prepared statements nativos (mais seguro)
- Concatenacao de string em SQL -> **vulneravel**

### 5. XSS e seguranca de renderizacao

Procure:
- `dangerouslySetInnerHTML` em qualquer componente (Biome desabilitou `noDangerouslySetInnerHtml` em `src/components/ui/`)
- HTML vindo de APIs externas renderizado sem sanitizacao
- Uso de `dompurify` ou `isomorphic-dompurify` (projeto tem ambos como dependencia) - verificar se sao usados onde necessario
- URLs dinamicas em `<a href>` ou `<iframe src>`

Nao reportar:
- XSS em JSX comum (React escapa por padrao)
- Ausencia de sanitizacao em texto puro

### 6. CSRF, CORS e headers

Procure:
- Server Actions que fazem mutacao sem verificacao de origem
- API routes sem protecao CSRF
- CORS configuration permissiva
- Ausencia de headers de seguranca (CSP, X-Frame-Options, HSTS, X-Content-Type-Options)
- `next.config.ts` sem `headers()` ou middleware de seguranca

### 7. Cache e vazamento entre usuarios

Procure:
- `'use cache'` em componentes ou funcoes que retornam dados personalizados por usuario
- Tags de cache que nao distinguem entre usuarios (ex: `CACHE_TAGS.products` e global)
- `cacheLife` e `cacheTag` em dados de CRM, agenda, pedidos que deveriam ser por usuario
- Invalidacao de cache: quem pode chamar `revalidateTag`?
- `next.config.ts` tem `cacheComponents: true` - verificar impacto em dados de usuario

Pontos de atencao neste projeto:
- Tags dinamicas como `customerLatestProducts(id)` sao por cliente - verificar se o ID e validado
- Tags de CRM (`crmLeadsByOrg`, `crmTasksByUser`) - verificar separacao
- Cache global (`products`, `categories`, `navigation`) - provavelmente seguro se for publico

### 8. Dependencias e supply chain

Execute `pnpm audit` e reporte:
- Vulnerabilidades conhecidas em next, react, better-auth, mysql2, axios, zod, resend
- Pacotes com scripts postinstall suspeitos
- Dependencias desatualizadas com CVEs conhecidos
- Nao corrija automaticamente - apenas reporte

### 9. Configuracao e operacao

Procure em `next.config.ts`:
- Source maps em producao
- `dangerouslyAllowLocalIP: true` em images
- Headers de seguranca ausentes
- Remote patterns de imagens amplos

Procure no codigo:
- Erros que vazam stack traces para o client
- Logs com dados sensiveis (senhas, tokens, dados pessoais)
- `NODE_ENV === "development"` que libera dados em producao
- `ErroExecucaoConsulta` que pode expor query SQL em dev

### 10. Integracoes externas

Procure:
- API key enviada em header Authorization para API externa - verificar se e seguro
- Webhook URLs (`WEBHOOK_REVALIDATE_URL1/2`) - proteger contra SSRF
- Resend email - verificar se destino e validado
- ViaCEP - verificar se CEP e validado antes da chamada
- API de assets - verificar upload sem autenticacao
