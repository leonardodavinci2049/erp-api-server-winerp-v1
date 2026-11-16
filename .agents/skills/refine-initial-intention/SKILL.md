---
name: refine-initial-intention
description: Improve only the clarity, grammar, Markdown formatting, and reference links of a raw initial intention text written in Brazilian Portuguese, without adding new elements, restructuring it into a plan, or requiring a questionnaire; save the improved text under docs/initial-prompt mirroring the source file identifier. Use when the user asks to clean up, polish, correct, or clarify a raw intention text before any planning or execution. Do not use to create an action plan, an executing prompt, or to implement the task.
---

# Refine Initial Intention

## Purpose

Produce a cleaner, clearer version of the user's raw intention text so that a coding agent can understand what needs to be solved. This is a text-quality pass only: fix grammar, style, Markdown formatting, and reference links, and make the existing wording clearer. Do not add new elements, turn it into an action plan, or solve the task.

## Core Rule

Improve the wording that is already there; do not add content or plan the work.

- Fix spelling, punctuation, agreement, redundancy, and ambiguity in the existing text.
- Keep the refined text close to the source length; prefer shorter wording after removing repetition.
- Preserve every original requirement, constraint, scope note, exclusion, and technical decision as written. Do not soften, broaden, or invent any of them.
- Do not add new sections, requirements, acceptance criteria, phases, risks, questionnaires, or deliverables that the source does not contain.
- Do not turn the text into an action plan, an executing prompt, or a specification; it remains an intention/description.
- Do not implement, investigate deeply, or otherwise execute the described task.
- In the improved text, never mention refinement, this skill, the source file, or the work performed. Begin directly with the intention.

## Workflow

1. Identify the source intention file. If the user gave a path, use it; otherwise use the most recently modified file under `docs/initial-intention/`. Read it.
2. Read the applicable `AGENTS.md` files only to confirm that referenced paths, routes, and symbols exist; do not investigate the task itself.
3. Correct grammar, spelling, punctuation, agreement, style, and ambiguity while preserving meaning.
4. Apply Markdown hygiene: correct heading hierarchy, a single blank line between blocks, code spans for paths/routes/commands/identifiers, and valid `-` lists.
5. Convert file and route mentions into relative Markdown links from the output file location back to the real repository path; remove absolute local paths (e.g., `/home/...`, `C:\...`).
6. Preserve and clarify the sections already present in the source. If a heading is unclear, standardize it to a canonical heading that matches its own content (e.g., Contexto, Problema, Objetivo, Escopo/Arquivos afetados, Observações). Include only sections that have corresponding source content; never invent content to fill a section.
7. Keep the whole result in Brazilian Portuguese.
8. Save it using the output rules below and report the path. Do not execute the task.
9. After saving, ask the user to review and ask whether they want an English version of the improved text; create it only if requested.

## Output File

The output keeps the source file's slug so the refined text pairs one-to-one with its source, but uses the current local date and time at the moment of saving. Save it at:

```text
docs/initial-prompt/YYYY/MM/YYYY-MM-DD-HHmm-<slug>.md
```

- `YYYY`, `MM`, and `YYYY-MM-DD-HHmm` come from the current local date and time at the moment of saving, never from the source filename.
- `<slug>` is the source filename with its leading date/time prefix removed.
- If the source filename does not match the dated pattern, use a lowercased kebab-case version of the source filename (without extension) as the slug.
- Create missing year and month directories.
- Never overwrite an existing file. If the output filename for the current local timestamp already exists, keep the same slug and increment the timestamp by one minute, preserving zero padding and rolling over the date, month, or year when necessary, until an unused filename is found. When the increment changes the month or year, use the corresponding `YYYY/MM` output directory. Never append numeric suffixes such as `-02` to the slug.
- Exclude secrets and personal data; use descriptive placeholders.

Preserve the source title as a level-1 heading (corrected) and keep the source's section headings (cleaned up). Do not add metadata headers; keep the output a clean, faithful improvement of the source text.

## Language

Always write the improved intention in Brazilian Portuguese (`pt-BR`). Preserve code identifiers, file paths, routes, commands, configuration keys, table/column names, and other technical literals exactly as they appear in the repository.

## Boundaries

- Do not implement, test, deploy, commit, or otherwise execute the described task.
- Do not add requirements, constraints, sections, or elements not present in the source.
- Do not convert the intention into a plan, an execution prompt, or a specification; use `create-action-plan` or `create-execution-prompt` for those instead.
- Do not change the meaning of any requirement; only clarify how it is written.
- Do not claim verification of a reference without checking the repository.
