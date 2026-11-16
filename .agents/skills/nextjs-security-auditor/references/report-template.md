# Template de Relatorio de Auditoria de Seguranca

Copie este template ao gerar o relatorio final. Substitua os placeholders.

---

```markdown
# Relatorio de Auditoria de Seguranca

**Projeto:** wholesale-e-commerce-web-app-v1
**Data:** YYYY-MM-DD
**Escopo:** repositorio local
**Stack identificada:** Next.js 16, React 19, TypeScript, better-auth, MySQL, axios, Zod

## Sumario Executivo

- **Postura geral:** [descricao concisa da postura de seguranca do projeto]
- **Total de achados por severidade:**
  - Critico: N
  - Alto: N
  - Medio: N
  - Baixo: N
  - Informativo: N
- **Riscos mais urgentes:** [1-3 riscos que exigem acao imediata]
- **Primeiras acoes recomendadas:** [2-4 acoes concretas para comecar]

## Metodologia

- **Arquivos e areas analisadas:** [lista de diretorios/arquivos revisados]
- **Comandos executados:** [lista de comandos rg/audit usados]
- **Limitacoes:** [o que nao foi possivel verificar e por que]

## Achados Confirmados

### SEC-001: [Titulo curto do problema]

- **Severidade:** Critico | Alto | Medio | Baixo | Informativo
- **Categoria:** auth | authorization | secret | injection | xss | csrf | cors | cache | dependency | config | data-exposure | logging
- **Confianca:** Alta | Media | Baixa
- **Localizacao:** `arquivo:linha`
- **Evidencia:** [trecho curto ou descricao objetiva, sem expor segredo real]
- **Caminho de exploracao:** [como um atacante poderia explorar]
- **Impacto:** [consequencia para negocio/dados/sistema]
- **Recomendacao:** [correcao sugerida]
- **Validacao apos correcao:** [como confirmar que resolveu]

### SEC-002: [Titulo]

[mesma estrutura]

## Pontos Para Investigar

Itens suspeitos sem evidencia suficiente para achado confirmado.

### INV-001: [Titulo]

- **Localizacao:** `arquivo:linha`
- **Suspeita:** [descricao]
- **Por que nao e confirmado:** [o que falta para confirmar ou descartar]

## Itens Verificados Sem Achado

Areas revisadas onde nao foi identificado problema concreto.

- [x] Validacao Zod em `src/core/config/envs.server.ts` - valores de env nao sao expostos
- [x] Queries SQL em [modulo] - todas usam parametros preparados
- [ ] ... (continuar para cada area verificada)

## Plano de Acao Priorizado

### 1. Imediato (hoje)

- [ ] Acao 1
- [ ] Acao 2

### 2. Esta semana

- [ ] Acao 3
- [ ] Acao 4

### 3. Proxima iteracao

- [ ] Acao 5

### 4. Backlog

- [ ] Acao 6

## Apontamentos Para Hardening

Melhorias defensivas sem vulnerabilidade concreta demonstrada.

1. [Sugestao de hardening]
2. [Sugestao de hardening]
```

---

## Regras para preenchimento

- Nunca inclua valores reais de segredos, senhas ou tokens. Use `***REDACTED***`.
- Sempre inclua arquivo e linha na localizacao.
- Confianca "Baixa" so deve ser usada em "Pontos Para Investigar".
- O plano de acao deve referenciar os SEC-NNN correspondentes.
- Idioma: pt-BR.
