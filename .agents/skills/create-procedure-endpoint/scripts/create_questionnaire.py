#!/usr/bin/env python3
"""Cria, sem sobrescrever, o questionário prévio de um endpoint de procedure."""

from __future__ import annotations

import argparse
import datetime as dt
import re
from pathlib import Path
from zoneinfo import ZoneInfo


TIMEZONE = ZoneInfo("America/Fortaleza")
PENDING = "[PENDENTE]"


def normalize_procedure_name(value: str) -> str:
    normalized = re.sub(r"[^a-zA-Z0-9_-]+", "-", value.strip()).strip("-_")
    if not normalized:
        raise ValueError("nome da procedure inválido")
    return normalized.lower()


def normalize_answer(value: str | None) -> str:
    if value is None or not value.strip():
        return PENDING
    return " ".join(value.strip().splitlines())


def parse_timestamp(value: str | None) -> dt.datetime:
    if value is None:
        return dt.datetime.now(TIMEZONE)

    parsed = dt.datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=TIMEZONE)
    return parsed.astimezone(TIMEZONE)


def available_path(directory: Path, stem: str) -> Path:
    candidate = directory / f"{stem}.md"
    suffix = 2
    while candidate.exists():
        candidate = directory / f"{stem}-{suffix:02d}.md"
        suffix += 1
    return candidate


def question_block(number: int, question: str, answer: str | None) -> list[str]:
    return [
        f"### {number}. {question}",
        "",
        f"**Resposta:** {normalize_answer(answer)}",
        "",
    ]


def build_document(args: argparse.Namespace, generated_at: dt.datetime) -> str:
    questions: list[tuple[str, str | None]] = [
        (
            "Qual arquivo contém a definição SQL completa da procedure?",
            args.procedure_file,
        ),
        (
            "Qual arquivo contém uma chamada de exemplo com valores seguros para desenvolvimento?",
            args.call_example_file,
        ),
        (
            "Em qual módulo de `src/` o endpoint deve ser implementado?",
            args.module,
        ),
        (
            "Qual arquivo de DTO deve ser usado como referência?",
            args.dto_reference,
        ),
        (
            "Qual endpoint aprovado deve orientar query, tipos, service, controller e documentação?",
            args.endpoint_reference,
        ),
        (
            "Qual deve ser o slug da rota `POST /api/<modulo>/v2/<slug>`?",
            args.endpoint_slug,
        ),
        (
            "A mesma versão da procedure já está instalada e disponível no banco de desenvolvimento deste checkout?",
            args.deployed_in_development,
        ),
        (
            "A execução HTTP é somente leitura? Se houver mutação, qual autorização explícita, massa de teste e estratégia de limpeza devem ser usadas?",
            args.runtime_test_authorization,
        ),
    ]

    questions.extend((question, None) for question in args.extra_question)

    lines = [
        f"# Questionário prévio - `{args.procedure_name}`",
        "",
        f"- Gerado em: `{generated_at.isoformat(timespec='seconds')}`",
        "- Status: `Aguardando respostas e validação`",
        "- Regra: nenhuma implementação deve começar enquanto houver pendência material.",
        "",
        "## Perguntas e respostas",
        "",
    ]

    for number, (question, answer) in enumerate(questions, start=1):
        lines.extend(question_block(number, question, answer))

    lines.extend(
        [
            "## Divergências ou decisões adicionais",
            "",
            PENDING,
            "",
        ]
    )
    return "\n".join(lines)


def create_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("procedure_name", help="Nome exato da stored procedure")
    parser.add_argument("--root", default=".", help="Raiz do repositório")
    parser.add_argument("--procedure-file")
    parser.add_argument("--call-example-file")
    parser.add_argument("--module")
    parser.add_argument("--dto-reference")
    parser.add_argument("--endpoint-reference")
    parser.add_argument("--endpoint-slug")
    parser.add_argument("--deployed-in-development")
    parser.add_argument("--runtime-test-authorization")
    parser.add_argument(
        "--extra-question",
        action="append",
        default=[],
        help="Pergunta adicional; pode ser repetida no máximo duas vezes",
    )
    parser.add_argument(
        "--timestamp",
        help="Timestamp ISO 8601 opcional, destinado a testes determinísticos",
    )
    return parser


def main() -> int:
    parser = create_parser()
    args = parser.parse_args()

    if len(args.extra_question) > 2:
        parser.error("use no máximo duas perguntas adicionais")

    try:
        procedure_slug = normalize_procedure_name(args.procedure_name)
        generated_at = parse_timestamp(args.timestamp)
    except ValueError as error:
        parser.error(str(error))

    repo_root = Path(args.root).resolve()
    output_dir = (
        repo_root
        / "docs"
        / "questions"
        / generated_at.strftime("%Y")
        / generated_at.strftime("%m")
    )
    output_dir.mkdir(parents=True, exist_ok=True)

    stem = f"{generated_at.strftime('%Y-%m-%d-%H%M')}-{procedure_slug}"
    output_path = available_path(output_dir, stem)
    output_path.write_text(build_document(args, generated_at), encoding="utf-8")

    print(output_path.relative_to(repo_root))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
