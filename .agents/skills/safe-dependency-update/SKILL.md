---
name: safe-dependency-update
description: "Use para atualizar dependencias npm/pnpm com seguranca em projetos TypeScript/Next.js/React: agrupar pacotes por risco, evitar versoes recem-publicadas com menos de 24 horas, revisar sinais de supply chain, lidar com pacotes deprecated, validar com lint/build a cada etapa e entregar resumo auditavel."
---

# Skill: Safe Dependency Update

Use esta skill para atualizar dependencias do projeto de forma incremental, auditavel e defensiva contra quebras e riscos basicos de supply chain.

## Regras obrigatorias

1. Nao atualize todos os pacotes de uma vez.
2. Rode baseline antes de alterar dependencias: `pnpm outdated`, `pnpm lint`, `pnpm build`.
3. Se o baseline falhar, corrija ou reporte o problema antes de iniciar updates.
4. Agrupe updates por risco e valide apos cada grupo com `pnpm lint` e `pnpm build`.
5. Nao instale uma versao publicada ha menos de 24 horas, salvo autorizacao explicita do usuario.
6. Se `latest` tiver menos de 24 horas, escolha a versao estavel mais recente publicada ha pelo menos 24 horas. Se nao houver versao segura, pule o pacote e reporte.
7. Nao aprove novos lifecycle/build scripts de dependencias sem justificativa explicita.
8. Preserve mudancas do usuario e nao reverta arquivos fora do escopo.

## Fluxo

### 1. Levantar contexto

Leia `AGENTS.md`, `package.json`, o lockfile e o estado do git.

Comandos uteis:

```bash
git status --short
pnpm outdated
pnpm lint
pnpm build
```

Considere `pnpm outdated` com exit code diferente de zero como informativo quando listar pacotes desatualizados.

### 2. Classificar risco

Use estes grupos como ponto de partida:

| Risco | Pacotes |
|---|---|
| Baixo | tipos, linters, formatadores, devDependencies simples, patch/minor pequeno |
| Medio | UI, validacao, formularios, emails, datas, HTTP clients, sanitizacao, libs auxiliares de runtime |
| Alto | Next.js, React, auth, banco, ORM, build tools, TypeScript, Tailwind/PostCSS, pacotes deprecated, major updates |

Se um pacote for de baixo risco por semver mas critico para runtime, suba o risco.

### 3. Fazer triagem de supply chain por pacote

Antes de instalar uma versao alvo, verifique metadados no registry.

Comandos uteis:

```bash
npm view <pacote>@latest version time deprecated engines peerDependencies dist.integrity --json
npm view <pacote> versions time --json
pnpm audit --audit-level high
```

Analise:

- idade da versao alvo;
- pacote ou versao deprecated;
- mudancas relevantes em peer dependencies e engines;
- ausencia ou mudanca suspeita de integridade no lockfile;
- vulnerabilidades novas em `pnpm audit`;
- novos build scripts ignorados ou solicitando aprovacao;
- saltos de major version ou troca de pacote mantido por outro.

Politica de 24 horas:

- Calcule a idade usando o campo `time` da versao alvo.
- Se `latest` tiver menos de 24 horas, nao instale `latest`.
- Escolha a versao estavel mais nova com `time[version] <= agora - 24h`.
- Evite pre-releases (`alpha`, `beta`, `rc`, `next`, `canary`) salvo se o projeto ja usar pre-release ou o usuario pedir.
- Se a unica versao disponivel for nova demais, pule e registre como pendente por quarentena.

### 4. Atualizar em etapas

Atualize um grupo por vez, iniciando pelo menor risco.

Use `pnpm update --latest <pacotes...>` apenas para pacotes cuja versao `latest` passou na politica de 24 horas. Para pacotes em quarentena, instale versoes especificas:

```bash
pnpm add <pacote>@<versao-segura>
pnpm add -D <pacote>@<versao-segura>
```

Depois de cada grupo:

```bash
pnpm lint
pnpm build
git diff --stat
```

Se houver erro:

1. identifique o pacote mais provavel;
2. leia changelog/docs oficiais quando necessario;
3. corrija o codigo ou config afetada;
4. rode `pnpm lint` e `pnpm build` novamente;
5. avance somente quando passar.

### 5. Revisar lockfile e scripts

Apos cada grupo relevante, revise `package.json` e `pnpm-lock.yaml` de forma proporcional ao tamanho do diff.

Procure:

- dependencias inesperadas;
- remocao/adicao grande demais para o pacote atualizado;
- lifecycle scripts novos;
- warnings de `Ignored build scripts`;
- pacotes deprecated diretos ou transientes;
- peers quebrados.

Nao rode `pnpm approve-builds` sem explicar o motivo e pedir autorizacao quando isso liberar scripts de terceiros.

### 6. Fechamento

No final, rode:

```bash
pnpm outdated
pnpm lint
pnpm build
pnpm audit --audit-level high
git status --short
```

Se `pnpm audit` falhar por vulnerabilidade pre-existente, nao trate automaticamente como falha da atualizacao; compare com o baseline quando disponivel e reporte.

## Resumo final obrigatorio

Entregue em pt-BR:

- pacotes atualizados, com versoes anteriores e novas quando relevante;
- grupos de risco usados;
- pacotes pulados por quarentena de 24 horas, deprecated, incompatibilidade ou falta de versao segura;
- erros encontrados e correcoes aplicadas;
- resultado final de `pnpm lint`;
- resultado final de `pnpm build`;
- resultado de `pnpm outdated`;
- resultado de `pnpm audit --audit-level high` ou motivo para nao executar;
- observacoes importantes sobre breaking changes, deprecated packages, build scripts e acoes manuais.
