#!/usr/bin/env bash
set -euo pipefail

# Creates and publishes a semantic-versioned release from develop.
# package.json is the source of truth for the current application version.
# Aborts when develop is behind origin/develop, so a release never starts from
# a stale history (which causes non-fast-forward pushes).

readonly EXPECTED_BRANCH="develop"
readonly REMOTE_NAME="origin"
readonly MAIN_BRANCH="$(git config --get gitflow.branch.master || printf 'main')"

usage() {
  echo "Uso: $0 [versão]"
  echo "Sem argumento: incrementa automaticamente o patch de package.json."
  echo "Exemplo: $0              # 1.1.1 -> release/1.1.2"
  echo "         $0 2.5.0        # usa manualmente a versão 2.5.0"
}

if [[ $# -gt 1 ]]; then
  usage
  exit 1
fi

if ! command -v git-flow >/dev/null 2>&1; then
  echo "❌ Erro: o comando git-flow não está instalado ou não está no PATH."
  exit 1
fi

CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "$EXPECTED_BRANCH" ]]; then
  echo "❌ Erro: este script deve ser executado na branch ${EXPECTED_BRANCH}."
  echo "   Branch atual: ${CURRENT_BRANCH:-detached HEAD}"
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet || [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
  echo "❌ Erro: existem alterações não commitadas. Faça commit antes de continuar."
  git status --short
  exit 1
fi

echo "🔄 Atualizando referências de ${REMOTE_NAME}..."
if ! git fetch --prune "${REMOTE_NAME}"; then
  echo "❌ Erro: não foi possível atualizar as referências de ${REMOTE_NAME}."
  echo "   Verifique a conexão, as credenciais e a configuração do remoto."
  exit 1
fi

if ! git rev-parse --verify --quiet "refs/remotes/${REMOTE_NAME}/${EXPECTED_BRANCH}" >/dev/null; then
  echo "❌ Erro: a referência ${REMOTE_NAME}/${EXPECTED_BRANCH} não existe localmente."
  echo "   Verifique se a branch ${EXPECTED_BRANCH} existe no remoto e tente novamente."
  exit 1
fi

COMMITTED_BEHIND=$(git rev-list --count "${EXPECTED_BRANCH}..${REMOTE_NAME}/${EXPECTED_BRANCH}")
if [[ "$COMMITTED_BEHIND" -gt 0 ]]; then
  echo "❌ Erro: a branch ${EXPECTED_BRANCH} local está ${COMMITTED_BEHIND} commit(s) atrás de ${REMOTE_NAME}/${EXPECTED_BRANCH}."
  echo "   Iniciar uma release a partir de uma branch desatualizada gera non-fast-forward no push."
  echo "   Integre o remoto e execute o script novamente:"
  echo "     git pull --ff-only ${REMOTE_NAME} ${EXPECTED_BRANCH}   # quando a branch local não divergiu"
  echo "     git merge ${REMOTE_NAME}/${EXPECTED_BRANCH}           # quando as histórias divergiram"
  exit 1
fi

COMMITTED_AHEAD=$(git rev-list --count "${REMOTE_NAME}/${EXPECTED_BRANCH}..${EXPECTED_BRANCH}")
if [[ "$COMMITTED_AHEAD" -eq 0 ]]; then
  echo "❌ Erro: não há commits locais em ${EXPECTED_BRANCH} além de ${REMOTE_NAME}/${EXPECTED_BRANCH}."
  echo "   Faça o commit das alterações antes de iniciar a release."
  exit 1
fi

CURRENT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || true)
if [[ ! "$CURRENT_VERSION" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]; then
  echo "❌ Erro: package.json.version não contém uma versão SemVer válida: ${CURRENT_VERSION:-vazia}."
  exit 1
fi

VERSION_ARGUMENT="${1:-}"
if [[ -n "$VERSION_ARGUMENT" ]]; then
  RELEASE_VERSION="$VERSION_ARGUMENT"
else
  IFS='.' read -r VERSION_MAJOR VERSION_MINOR VERSION_PATCH <<< "$CURRENT_VERSION"
  NEXT_PATCH=$((10#$VERSION_PATCH + 1))
  RELEASE_VERSION="${VERSION_MAJOR}.${VERSION_MINOR}.${NEXT_PATCH}"
fi

if [[ ! "$RELEASE_VERSION" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]]; then
  echo "❌ Erro: a versão deve seguir o formato major.minor.patch, por exemplo 2.5.0."
  exit 1
fi

if [[ -n "$VERSION_ARGUMENT" ]]; then
  IFS='.' read -r TARGET_MAJOR TARGET_MINOR TARGET_PATCH <<< "$RELEASE_VERSION"
  IFS='.' read -r CURRENT_MAJOR CURRENT_MINOR CURRENT_PATCH <<< "$CURRENT_VERSION"
  if (( TARGET_MAJOR < CURRENT_MAJOR || (TARGET_MAJOR == CURRENT_MAJOR && TARGET_MINOR < CURRENT_MINOR) || (TARGET_MAJOR == CURRENT_MAJOR && TARGET_MINOR == CURRENT_MINOR && TARGET_PATCH < CURRENT_PATCH) )); then
    echo "❌ Erro: a versão ${RELEASE_VERSION} é menor que a versão atual ${CURRENT_VERSION}."
    exit 1
  fi
fi

RELEASE_BRANCH="release/${RELEASE_VERSION}"
if git show-ref --verify --quiet "refs/heads/${RELEASE_BRANCH}"; then
  echo "❌ Erro: a branch ${RELEASE_BRANCH} já existe."
  exit 1
fi

if git show-ref --verify --quiet "refs/tags/${RELEASE_VERSION}"; then
  echo "❌ Erro: a tag ${RELEASE_VERSION} já existe."
  exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Branch atual:       ${CURRENT_BRANCH}"
echo "  Commits a publicar: ${COMMITTED_AHEAD}"
echo "  Versão atual:       ${CURRENT_VERSION}"
echo "  Versão da release:  ${RELEASE_VERSION}"
echo "  Branch da release:  ${RELEASE_BRANCH}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

read -r -p "Continuar? (s/N) " CONFIRM
if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
  echo "Operação cancelada."
  exit 0
fi

echo ""
echo "📦 Criando release ${RELEASE_VERSION} a partir de ${EXPECTED_BRANCH}..."
git flow release start "${RELEASE_VERSION}"

echo ""
echo "📝 Atualizando package.json para ${RELEASE_VERSION}..."
VERSION_TO_WRITE="${RELEASE_VERSION}" node -e 'const fs = require("node:fs"); const file = "package.json"; const version = process.env.VERSION_TO_WRITE; const source = fs.readFileSync(file, "utf8"); const versionLine = /^([ \t]*"version"[ \t]*:[ \t]*)"[^"\r\n]*"([ \t]*,?[ \t]*)(\r?\n|$)/m; if (!versionLine.test(source)) throw new Error("Could not find the package.json version line."); const updated = source.replace(versionLine, "$1\"" + version + "\"$2$3"); JSON.parse(updated); fs.writeFileSync(file, updated);'
if ! git diff --quiet -- package.json; then
  git add -- package.json
  git commit -m "chore(release): ${RELEASE_VERSION}"
else
  echo "   package.json já está na versão ${RELEASE_VERSION}; nenhum commit adicional é necessário."
fi

echo ""
echo "✅ Finalizando release ${RELEASE_VERSION}..."
GIT_MERGE_AUTOEDIT=no git flow release finish -m "release finish ${RELEASE_VERSION}" "${RELEASE_VERSION}"

echo ""
echo "🚀 Enviando para o remoto (${MAIN_BRANCH} + ${EXPECTED_BRANCH} + tags)..."
git push "${REMOTE_NAME}" "${MAIN_BRANCH}" "${EXPECTED_BRANCH}" --follow-tags

echo ""
echo "🌿 Posicionando na branch ${EXPECTED_BRANCH}..."
git switch "${EXPECTED_BRANCH}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Concluído!"
echo "  Branch atual: ${EXPECTED_BRANCH}"
echo "  Release: ${RELEASE_VERSION}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
