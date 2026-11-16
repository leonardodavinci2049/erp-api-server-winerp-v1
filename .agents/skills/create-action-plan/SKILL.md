---
name: create-action-plan
description: Create a concise coding action plan in Brazilian Portuguese from an initial prompt under docs/initial-prompt; first save a 3-to-10-question questionnaire using the current local timestamp and wait for the user's answers, then correct verified references, resolve material ambiguities, assess continuous versus staged execution, add a mandatory develop-based branch/worktree choice for the future coding agent, and save the actionable plan under docs/action-plan. Use for multi-phase, dependency-sensitive, cross-module, risky, or gate-dependent work that needs an explicit plan before implementation. Do not execute the plan.
---

# Create Action Plan

## Purpose

Produce a concise, standalone, executable action plan from an initial prompt (an intention text under `docs/initial-prompt/`). Before writing the plan, save a short questionnaire and wait for the user's answers. Use those answers to preserve the user's intent while fixing inaccurate references, material ambiguity, sequencing, dependencies, validation, deliverables, and the execution strategy. Save the plan without executing it.

## Pipeline

This is a final stage of:

```text
docs/initial-intention -> docs/initial-prompt (via refine-initial-intention)
  -> docs/questions -> docs/action-plan (this skill)
  OR docs/prompt-for-execution (via create-execution-prompt)
```

Choose this skill when one or more of these factors materially apply: multiple modules or repositories, ordered dependencies, contract or data changes, migrations, external-state changes, intermediate validation, rollback concerns, or approval gates. For a single-scope, low-risk task that can be executed continuously with one natural validation point, use `create-execution-prompt` instead. The two are alternative endpoints, not sequential steps; run only one of them.

## Core Rule

Create the plan from the initial prompt and the user's questionnaire answers; do not implement it or invent scope beyond them.

- The required input is a file under `docs/initial-prompt/`, normally produced by `refine-initial-intention`. If none exists, stop and ask the user to create one first.
- Never write the action plan before saving the mandatory questionnaire and receiving the user's answers.
- Preserve the original objective, scope, exclusions, constraints, and relevant technical decisions stated in the initial prompt.
- Remove repetition and combine overlapping steps.
- Reorder steps only when needed to respect dependencies or make execution safer.
- Add only details needed to make a step actionable, correct a verified reference, resolve material ambiguity, define a requested deliverable, or verify completion.
- Keep suggestions optional unless the user explicitly made them requirements.
- Do not broaden scope, invent product requirements, or redesign the proposed solution without evidence that the initial prompt cannot meet its objective.
- Keep process details out of the plan body. Limit traceability to the source and questionnaire metadata required by the output template.

## Workflow

1. Locate the source initial prompt under `docs/initial-prompt/`. If the user gave a path, use it; otherwise use the most recently modified file. If none exists, stop and ask the user to create one first via `refine-initial-intention`.
2. Read the applicable `AGENTS.md` files, inspect the working tree, and verify only the repository references needed to formulate useful questions.
3. Extract the objective, scope, exclusions, constraints, decisions, dependencies, deliverables, validation, and material ambiguities already present in the initial prompt.
4. Search `docs/questions/` for a questionnaire whose `Prompt inicial` metadata points to the exact source path:
   - if it is awaiting answers and the current user message does not answer it, report its path and stop;
   - if the user has supplied its answers, record them faithfully and concisely in that questionnaire, change its state to `respondido`, and continue;
   - if it is already answered and has no linked action plan, reuse it and continue;
   - if it already links to an existing action plan, report that result and stop unless the user explicitly requested a new revision.
5. If no reusable questionnaire exists, create and save the mandatory pre-plan questionnaire described below. Report its path and stop without writing the action plan.
6. Resume only after the user answers. Record the answers in the existing questionnaire, mark it as `respondido`, and incorporate them as decisions. If one material ambiguity remains, append one concise follow-up question to the same file and wait again.
7. Verify any additional repository references affected by the answers. Correct verified errors, remove duplication, and preserve the confirmed scope.
8. Evaluate whether execution should be continuous or divided into stages using the criteria below.
9. Write the plan in Brazilian Portuguese using direct imperative language, concrete results, dependency-aware ordering, and the selected execution strategy.
10. Save it using the output rules below, add the plan path to the questionnaire metadata, and report the result. Do not execute the plan.

## Mandatory Pre-Plan Questionnaire

Before writing any action plan:

- Write 3 to 10 concise questions whose answers could materially improve planning accuracy. Do not add filler questions merely to increase the count.
- Cover only decisions relevant to scope, behavior, contracts, data, security, architecture, compatibility, validation, or delivery.
- Derive a concise semantic slug from the source filename, excluding its date/time prefix and any prior numeric collision suffix.
- Use the current local date and time at questionnaire creation and save it at `docs/questions/YYYY/MM/YYYY-MM-DD-HHmm-<slug>.md`, relative to the repository root.
- Create missing directories and never overwrite an existing file. If the candidate path exists, advance the candidate timestamp by one minute, including date rollover when necessary, until the path is free. Do not append a numeric suffix.
- Write every question in Brazilian Portuguese.
- Each question may include one or more recommended options when supported by the available context. Label options with letters, mark each recommendation as `Recomendada`, and briefly explain its benefit or tradeoff. Put recommended options first; do not invent alternatives merely to fill the list.
- State whether the user should choose one option or may combine compatible options. Multiple recommendations may be complementary or conditional; make any conditions and mutually exclusive choices explicit.
- Allow free-text answers, including combinations or adjustments to the suggestions. Recommendations are not answers or authorization; keep the questionnaire pending until the user responds.
- Include the source path, intended output type, state, numbered questions, and an answers section using the template below.
- After saving, report the questionnaire path and stop. Do not write the plan, implement code, or run the plan's validation before the user answers.

Treat the user's next response as the questionnaire answers. Do not require the user to copy them into the file.

Use this compact structure:

```markdown
# Questionário: <título curto>

- Criado em: `<data e hora local no formato ISO 8601>`
- Prompt inicial: `<caminho relativo>`
- Saída pretendida: `action-plan`
- Estado: `aguardando respostas`
- Plano de ação: `pendente`

## Perguntas

1. <Pergunta material em pt-BR?>

   <Quando houver opções, indique: escolha uma ou combine as opções compatíveis.>
   - **A — <Opção> (Recomendada):** <benefício ou impacto breve>.
   - **B — <Outra opção, se útil>:** <benefício ou impacto breve; marque também como Recomendada quando houver fundamento e indique condições, se aplicáveis>.
   - **Resposta livre:** <permita outra proposta ou ajustes às opções>.

## Respostas

<Aguardando respostas pelo chat ou neste arquivo.>
```

## Execution Strategy Assessment

Always decide whether the plan should use continuous execution or staged execution and record the decision with a short rationale.

Prefer continuous execution for small, tightly coupled, low-risk work that has one natural validation point. Divide execution into stages when one or more of these factors materially apply:

- distinct workstreams or repositories have clear dependency boundaries;
- a data migration, destructive operation, deployment, or external-state change needs an explicit gate;
- an intermediate result can be validated independently before later work begins;
- early user or visual feedback can prevent significant rework;
- the task is long enough that separate deliverables improve review, rollback, or recovery.

Do not create stages based only on file count or superficial categories. When using stages:

- give each stage a concrete outcome, prerequisites, scoped steps, and validation or exit criteria;
- order stages by dependency and identify what blocks the next stage;
- state whether a user confirmation is required between stages, requiring it only for a material decision, destructive or external change, deployment, or another risk that justifies the pause.

## Mandatory Coding Workspace Gate

Every generated action plan must instruct the future coding agent to perform this gate after the questionnaire has been answered and immediately before executing any plan step:

1. Inspect and report the actual checkout path, current branch, concise working-tree status, and registered worktrees. Propose a concise `feature/<slug>` branch name derived from the task.
2. Ask whether the new feature branch should be created in the current directory or in a new worktree. Stop and wait for the user's choice; do not create or switch branches before the answer.
3. After the user chooses, create the new feature branch from the local `develop` branch in the selected location and confirm the resulting physical path and branch before editing code.
4. If the current-directory option is selected, preserve all existing changes. Never discard, stash, relocate, or mix them automatically; if they make the branch operation unsafe, report the exact blocker and ask for direction.
5. If the worktree option is selected, use the local `$create-feature-worktree` skill with `develop` as the base when it is available and applicable. Do not copy its workflow manually unless that skill cannot be used.

Keep this separate from the 3-to-10-question planning questionnaire. This skill only writes the gate into the action plan; it must not create a branch or worktree itself.

## Quality Standard

- Keep the plan proportional to the initial prompt; prefer concise steps over exhaustive commentary.
- Use the questionnaire answers as confirmed planning inputs without broadening them into unstated requirements.
- Use stages only when the execution-strategy assessment justifies them.
- For each step, identify the action and the expected result. Add paths or symbols only when verified and useful.
- Include validation that is appropriate to the repository and the change. Do not invent unavailable test commands.
- Include the mandatory coding workspace gate exactly once and before the first implementation step.
- Include risks, rollback, migration, or compatibility work only when the initial prompt or inspected repository makes them materially relevant.
- Keep the review summary to at most three short bullets in total.

## Language

Always write the action plan and pre-execution questionnaire in Brazilian Portuguese (`pt-BR`), even when the source is written in another language. Apply Brazilian Portuguese to titles, section headings, summaries, instructions, and questions. Preserve code identifiers, file paths, routes, commands, configuration keys, table/column names, and other technical literals exactly as they appear in the repository.

## Output File

Treat `docs` as relative to the repository root. Save the result at:

```text
docs/action-plan/YYYY/MM/YYYY-MM-DD-HHmm-<slug>.md
```

- Use the current local date and time when creating the plan and the same semantic slug used by the questionnaire.
- Create missing year and month directories and never overwrite an existing plan. If the candidate path exists, advance the candidate timestamp by one minute, including date rollover when necessary, until the path is free. Do not append a numeric suffix.
- Exclude secrets and personal data; use descriptive placeholders.

Use this compact structure:

```markdown
# Plano de ação: <título curto>

- Gerado em: `<data e hora local no formato ISO 8601>`
- Prompt inicial: `<caminho relativo>`
- Questionário: `<caminho relativo>`

## Ajustes

- <Somente correção ou premissa relevante; omita esta seção quando não houver nenhuma.>

## Objetivo

<Resultado esperado em um parágrafo curto.>

## Preparação obrigatória da execução

<Instrua o agente de código a inspecionar o checkout, perguntar se a branch `feature/<slug>` baseada em `develop` deve ser criada no diretório atual ou em uma nova worktree, parar para aguardar a escolha e só então preparar o local selecionado.>

## Estratégia de execução

<Execução contínua ou dividida em N etapas, com justificativa curta e indicação de gates entre etapas quando necessários.>

## Plano de ação

<Use uma lista numerada contínua ou subtítulos `### Etapa N: <resultado>` com passos, dependências e critérios de saída.>

## Validação

- <Verificação proporcional ao escopo.>
```

Omit optional sections that add no value. `Estratégia de execução` is mandatory.

## Boundaries

- Do not implement, test, deploy, commit, or otherwise execute the plan.
- Do not create the plan without a source initial prompt under `docs/initial-prompt/`; ask for one first.
- Do not create the plan before the questionnaire is saved and the user has answered it.
- Do not create, switch, or modify branches or worktrees while producing the plan.
- Do not postpone the questionnaire until plan execution.
- Do not turn repository inspection findings into implementation work or unrelated analysis.
- Do not replace explicit user decisions with personal preferences.
- Do not broaden scope or invent requirements beyond the initial prompt.
- Do not claim verification without inspecting the referenced source.
