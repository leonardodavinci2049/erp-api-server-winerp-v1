#!/usr/bin/env python3
"""Validate the non-execution and questionnaire gates of this skill."""

from pathlib import Path


skill_file = Path(__file__).resolve().parents[1] / "SKILL.md"
skill_text = skill_file.read_text(encoding="utf-8")

ordered_markers = (
    "Search `docs/questions/`",
    "If no reusable questionnaire exists",
    "Resume only after the user answers",
    "Write the plan in Brazilian Portuguese",
)
required_markers = (
    "Write 3 to 10 concise questions",
    "Use the current local date and time",
    "advance the candidate timestamp by one minute",
    "Do not append a numeric suffix",
    "- Estado: `aguardando respostas`",
    "change its state to `respondido`",
    "Do not create the plan before the questionnaire is saved",
    "single-scope, low-risk task",
    "## Mandatory Coding Workspace Gate",
    "current directory or in a new worktree",
    "create the new feature branch from the local `develop` branch",
    "Stop and wait for the user's choice",
    "use the local `$create-feature-worktree` skill",
    "must not create a branch or worktree itself",
    "## Preparação obrigatória da execução",
)
forbidden_markers = (
    "append `-02`",
    "append `-03`",
    "before execution of the plan",
)

positions = [skill_text.find(marker) for marker in ordered_markers]
if -1 in positions or positions != sorted(positions):
    raise SystemExit("Questionnaire gate markers are missing or out of order")

missing = [marker for marker in required_markers if marker not in skill_text]
if missing:
    raise SystemExit(f"Missing workflow invariants: {missing}")

forbidden = [marker for marker in forbidden_markers if marker in skill_text]
if forbidden:
    raise SystemExit(f"Forbidden legacy workflow markers found: {forbidden}")

print("Workflow semantics are valid!")
