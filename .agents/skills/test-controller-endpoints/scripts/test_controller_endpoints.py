#!/usr/bin/env python3
"""Test POST endpoints from a NestJS controller and generate a Markdown report."""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import shlex
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Optional


HTTP_DECORATORS = {
    "Post": "POST",
}


@dataclass
class Endpoint:
    method_name: str
    http_method: str
    method_route: str
    endpoint_path: str
    url: str
    dto_name: Optional[str]
    dto_file: Optional[Path]
    request_body: Optional[str]
    auth_guard: bool
    status: str = "PENDING"
    http_status: Optional[str] = None
    response_body: str = ""
    response_is_json: bool = False
    error: str = ""
    curl_command: str = ""
    observation: str = "-"


def read_env(repo_root: Path) -> dict[str, str]:
    env_path = repo_root / ".env"
    values: dict[str, str] = {}
    if not env_path.exists():
        return values

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")
    return values


def route_from_decorator_args(args: str) -> str:
    match = re.search(r"""['"`]([^'"`]*)['"`]""", args.strip(), flags=re.S)
    return normalize_route_part(match.group(1) if match else "")


def normalize_route_part(value: str) -> str:
    return value.strip().strip("/")


def join_endpoint(*parts: str) -> str:
    clean = [normalize_route_part(part) for part in parts if normalize_route_part(part)]
    return "/" + "/".join(clean)


def shell_join_masked(command: list[str], api_key: str) -> str:
    masked = ["<API_KEY>" if api_key and item == api_key else item for item in command]
    joined = shlex.join(masked)
    if api_key:
        joined = joined.replace(api_key, "<API_KEY>")
    return joined


def parse_imports(controller_text: str, controller_path: Path, repo_root: Path) -> dict[str, Path]:
    imports: dict[str, Path] = {}
    pattern = re.compile(r"import\s*{\s*([^}]+)\s*}\s*from\s*['\"]([^'\"]+)['\"]", re.S)

    for match in pattern.finditer(controller_text):
        names = [part.strip().split(" as ")[-1].strip() for part in match.group(1).split(",")]
        source = match.group(2).strip()
        resolved = resolve_import_path(source, controller_path, repo_root)
        for name in names:
            if name:
                imports[name] = resolved
    return imports


def resolve_import_path(source: str, controller_path: Path, repo_root: Path) -> Path:
    if source.startswith("."):
        base = (controller_path.parent / source).resolve()
    elif source.startswith("src/"):
        base = (repo_root / source).resolve()
    else:
        base = (repo_root / source).resolve()

    ts_candidate = base if base.suffix == ".ts" else Path(f"{base}.ts")
    candidates = [base, ts_candidate, base / "index.ts"]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return ts_candidate


def extract_balanced_json(text: str, marker: str) -> Optional[str]:
    marker_index = text.find(marker)
    if marker_index == -1:
        return None

    start = text.find("{", marker_index)
    if start == -1:
        return None

    depth = 0
    in_string = False
    escape = False
    for index in range(start, len(text)):
        char = text[index]
        if in_string:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                candidate = text[start : index + 1]
                parsed = json.loads(candidate)
                return json.dumps(parsed, ensure_ascii=False, indent=2)
    return None


def collect_decorator_groups(lines: list[str]) -> list[tuple[str, str]]:
    groups: list[tuple[str, str]] = []
    index = 0
    while index < len(lines):
        if not lines[index].lstrip().startswith("@"):
            index += 1
            continue

        decorators: list[str] = []
        while index < len(lines) and lines[index].lstrip().startswith("@"):
            balance = 0
            while index < len(lines):
                line = lines[index]
                decorators.append(line)
                balance += line.count("(") - line.count(")")
                index += 1
                if balance <= 0:
                    break
            while index < len(lines) and not lines[index].strip():
                decorators.append(lines[index])
                index += 1

        signature: list[str] = []
        paren_balance = 0
        started = False
        while index < len(lines):
            line = lines[index]
            signature.append(line)
            paren_balance += line.count("(") - line.count(")")
            started = started or "(" in line
            index += 1
            if "{" in line and (not started or paren_balance <= 0):
                break
            if started and paren_balance <= 0 and re.search(r"\)\s*(?::[^{]+)?\s*{", "".join(signature), re.S):
                break
            if not started and len(signature) > 3:
                break

        groups.append(("".join(decorators), "".join(signature)))
    return groups


def find_controller_route(controller_text: str) -> Optional[str]:
    match = re.search(r"@Controller\s*\((.*?)\)", controller_text, flags=re.S)
    if not match:
        return None
    return route_from_decorator_args(match.group(1))


def find_controller_name(controller_text: str) -> str:
    match = re.search(r"\bclass\s+([A-Za-z0-9_]+)", controller_text)
    return match.group(1) if match else "Controller"


def discover_endpoints(controller_path: Path, repo_root: Path, base_url: str) -> tuple[str, list[Endpoint]]:
    controller_text = controller_path.read_text(encoding="utf-8")
    controller_route = find_controller_route(controller_text)
    if controller_route is None:
        raise ValueError(f"Controller decorator not found in {controller_path}")

    imports = parse_imports(controller_text, controller_path, repo_root)
    class_auth = bool(re.search(r"@UseGuards\s*\([^)]*\bAuthGuard\b[^)]*\)[\s\S]*?(?:@Controller|class\s)", controller_text))
    endpoints: list[Endpoint] = []

    for decorators, signature in collect_decorator_groups(controller_text.splitlines(keepends=True)):
        http_match = re.search(r"@(Post)\s*\((.*?)\)", decorators, flags=re.S)
        if not http_match:
            continue

        method_match = re.search(r"(?:public|private|protected)?\s*(?:async\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*\(", signature)
        if not method_match or method_match.group(1) in {"if", "for", "while", "switch"}:
            continue

        body_match = re.search(r"@Body\s*\([^)]*\)\s*[A-Za-z_][A-Za-z0-9_]*\s*:\s*([A-Za-z_][A-Za-z0-9_]*)", signature)
        dto_name = body_match.group(1) if body_match else None
        dto_file = imports.get(dto_name) if dto_name else None
        request_body = None
        observation = "-"
        status = "PENDING"

        if dto_name:
            if dto_file and dto_file.exists():
                dto_text = dto_file.read_text(encoding="utf-8")
                request_body = extract_balanced_json(dto_text, "Sample JSON for testing in body endpoint")
                if request_body is None:
                    status = "SKIPPED"
                    observation = "sample JSON não encontrado"
            else:
                status = "SKIPPED"
                observation = "arquivo DTO não encontrado"

        method_route = route_from_decorator_args(http_match.group(2))
        endpoint_path = join_endpoint("api", controller_route, method_route)
        endpoints.append(
            Endpoint(
                method_name=method_match.group(1),
                http_method=HTTP_DECORATORS[http_match.group(1)],
                method_route=method_route,
                endpoint_path=endpoint_path,
                url=f"{base_url}{endpoint_path}",
                dto_name=dto_name,
                dto_file=dto_file,
                request_body=request_body,
                auth_guard=class_auth or "AuthGuard" in decorators,
                status=status,
                observation=observation,
            )
        )

    return find_controller_name(controller_text), endpoints


def run_endpoint(endpoint: Endpoint, api_key: str) -> None:
    command = [
        "curl",
        "-sS",
        "-X",
        endpoint.http_method,
        endpoint.url,
        "-H",
        "Content-Type: application/json",
        "-H",
        "Accept: application/json",
        "--max-time",
        "60",
        "-w",
        "\n__HTTP_STATUS__:%{http_code}",
    ]

    if endpoint.auth_guard:
        command.extend(["-H", f"Authorization: Bearer {api_key}"])

    if endpoint.request_body is not None:
        command.extend(["--data", endpoint.request_body])

    endpoint.curl_command = shell_join_masked(command, api_key)

    if endpoint.auth_guard and not api_key:
        endpoint.status = "SKIPPED"
        endpoint.observation = "API_KEY não encontrado"
        endpoint.error = "Endpoint usa AuthGuard, mas API_KEY não foi encontrado no .env."
        return

    completed = subprocess.run(command, text=True, capture_output=True, check=False)
    stdout = completed.stdout
    stderr = completed.stderr.strip()
    marker = "\n__HTTP_STATUS__:"
    if marker in stdout:
        response_body, http_status = stdout.rsplit(marker, 1)
    else:
        response_body, http_status = stdout, ""

    endpoint.http_status = http_status.strip() or None
    endpoint.response_body = response_body.strip()
    endpoint.error = stderr
    endpoint.response_is_json = is_json(endpoint.response_body)

    status_code = int(endpoint.http_status or "0")
    if completed.returncode == 0 and 200 <= status_code <= 299:
        endpoint.status = "OK"
        endpoint.observation = "-"
    else:
        endpoint.status = "ERROR"
        endpoint.observation = summarize_error(stderr, endpoint.response_body, endpoint.http_status)


def is_json(value: str) -> bool:
    if not value:
        return False
    try:
        json.loads(value)
        return True
    except json.JSONDecodeError:
        return False


def summarize_error(stderr: str, response_body: str, http_status: Optional[str]) -> str:
    if stderr:
        return stderr.splitlines()[0][:120]
    if http_status and not http_status.startswith("2"):
        return f"HTTP {http_status}"
    if response_body:
        return response_body.replace("\n", " ")[:120]
    return "erro ao executar curl"


def markdown_code_block(language: str, value: str) -> str:
    return f"```{language}\n{value.rstrip()}\n```"


def write_report(
    repo_root: Path,
    controller_path: Path,
    controller_name: str,
    base_url: str,
    endpoints: list[Endpoint],
) -> Path:
    module_folder = controller_path.parent.name
    report_dir = repo_root / "API-documentation" / module_folder
    report_dir.mkdir(parents=True, exist_ok=True)
    report_path = report_dir / f"{controller_path.stem}-test.md"
    total = len(endpoints)
    executed = sum(1 for endpoint in endpoints if endpoint.status in {"OK", "ERROR"})
    ok = sum(1 for endpoint in endpoints if endpoint.status == "OK")
    error = sum(1 for endpoint in endpoints if endpoint.status == "ERROR")
    skipped = sum(1 for endpoint in endpoints if endpoint.status == "SKIPPED")
    timestamp = dt.datetime.now(dt.timezone.utc).isoformat()

    lines = [
        f"# Teste de endpoints - {controller_name}",
        "",
        f"- Controller: `{controller_path}`",
        f"- Data/hora: `{timestamp}`",
        f"- Base URL: `{base_url}`",
        f"- Total de endpoints descobertos: `{total}`",
        f"- Total executado: `{executed}`",
        f"- Total com sucesso: `{ok}`",
        f"- Total com erro: `{error}`",
        f"- Total ignorado: `{skipped}`",
        "",
        "## Resumo",
        "",
        "| Status | Método | Endpoint | HTTP | Observação |",
        "| --- | --- | --- | --- | --- |",
    ]

    for endpoint in endpoints:
        lines.append(
            f"| {endpoint.status} | {endpoint.http_method} | {endpoint.endpoint_path} | "
            f"{endpoint.http_status or '-'} | {endpoint.observation or '-'} |"
        )

    lines.extend(["", "## Detalhes", ""])

    for endpoint in endpoints:
        response_language = "json" if endpoint.response_is_json else "text"
        request_body = endpoint.request_body if endpoint.request_body is not None else "{}"
        response_body = endpoint.response_body or ""
        error = endpoint.error or ""
        curl = endpoint.curl_command or build_unexecuted_curl(endpoint)

        lines.extend(
            [
                f"### {endpoint.method_name}",
                "",
                f"- Status: `{endpoint.status}`",
                f"- Método HTTP: `{endpoint.http_method}`",
                f"- Endpoint: `{endpoint.endpoint_path}`",
                f"- URL: `{endpoint.url}`",
                f"- DTO: `{endpoint.dto_name or 'N/A'}`",
                f"- Arquivo DTO: `{endpoint.dto_file or 'N/A'}`",
                "",
                "#### cURL",
                "",
                markdown_code_block("bash", curl),
                "",
                "#### Request body",
                "",
                markdown_code_block("json", request_body),
                "",
                "#### Response",
                "",
                f"- HTTP status: `{endpoint.http_status or '-'}`",
                "",
                markdown_code_block(response_language, response_body),
                "",
                "#### Erro",
                "",
                markdown_code_block("text", error),
                "",
            ]
        )

    report_path.write_text("\n".join(lines), encoding="utf-8")
    return report_path


def build_unexecuted_curl(endpoint: Endpoint) -> str:
    command = [
        "curl",
        "-sS",
        "-X",
        endpoint.http_method,
        endpoint.url,
        "-H",
        "Content-Type: application/json",
        "-H",
        "Accept: application/json",
    ]
    if endpoint.auth_guard:
        command.extend(["-H", "Authorization: Bearer <API_KEY>"])
    if endpoint.request_body is not None:
        command.extend(["--data", endpoint.request_body])
    return shlex.join(command)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("controller", help="Path to the NestJS controller file")
    parser.add_argument("--discover-only", action="store_true", help="Generate the report without calling curl")
    args = parser.parse_args()

    repo_root = Path.cwd().resolve()
    controller_path = (repo_root / args.controller).resolve()
    if not controller_path.exists():
        print(f"Controller not found: {controller_path}", file=sys.stderr)
        return 1

    env = read_env(repo_root)
    port = env.get("APP_PORT", "3000") or "3000"
    api_key = env.get("API_KEY", "")
    base_url = f"http://localhost:{port}"

    try:
        controller_name, endpoints = discover_endpoints(controller_path, repo_root, base_url)
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 1

    for endpoint in endpoints:
        if endpoint.status == "SKIPPED":
            endpoint.curl_command = build_unexecuted_curl(endpoint)
            continue
        if args.discover_only:
            endpoint.status = "SKIPPED"
            endpoint.observation = "discover-only"
            endpoint.curl_command = build_unexecuted_curl(endpoint)
            continue
        run_endpoint(endpoint, api_key)

    report_path = write_report(repo_root, controller_path, controller_name, base_url, endpoints)
    print(f"Report written: {report_path}")
    print(
        "Totals: "
        f"discovered={len(endpoints)} "
        f"executed={sum(1 for endpoint in endpoints if endpoint.status in {'OK', 'ERROR'})} "
        f"ok={sum(1 for endpoint in endpoints if endpoint.status == 'OK')} "
        f"error={sum(1 for endpoint in endpoints if endpoint.status == 'ERROR')} "
        f"skipped={sum(1 for endpoint in endpoints if endpoint.status == 'SKIPPED')}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
