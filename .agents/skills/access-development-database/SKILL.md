---
name: access-development-database
description: Acessa e opera o banco MariaDB de desenvolvimento deste projeto usando o cliente de terminal `mariadb` e as credenciais do arquivo `.env`. Use quando o usuário pedir consultas, análises de dados ou schema, diagnóstico, EXPLAIN, conferência de tabelas/colunas/índices, execução de SQL, correção de dados, DDL ou qualquer outra ação que exija conexão com a base de desenvolvimento.
---

# Acessar o banco de desenvolvimento

Usar exclusivamente o binário `mariadb` instalado na instância. Carregar a
conexão das variáveis de ambiente do `.env` na raiz do projeto, sem revelar
credenciais.

## Preparar e validar a conexão

Executar comandos de banco dentro de `bash` e usar este preflight:

```bash
set -euo pipefail

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
cd "$PROJECT_ROOT"

set -a
source ./.env
set +a

for var_name in \
  APP_ENVIRONMENT DATABASE_HOST DATABASE_PORT DATABASE_NAME \
  DATABASE_USER DATABASE_PASSWORD
do
  if [ -z "${!var_name:-}" ]; then
    printf 'Erro: variável obrigatória %s não definida no .env\n' "$var_name" >&2
    exit 1
  fi
done

case "${APP_ENVIRONMENT,,}" in
  development|dev|local) ;;
  *)
    printf 'Erro: ambiente recusado: APP_ENVIRONMENT não é desenvolvimento.\n' >&2
    exit 1
    ;;
esac

CLIENT="$(command -v mariadb || true)"
if [ -z "$CLIENT" ]; then
  printf 'Erro: cliente mariadb não encontrado no PATH.\n' >&2
  exit 1
fi

DB_ARGS=(
  --protocol=TCP
  --connect-timeout=10
  --default-character-set=utf8mb4
  --show-warnings
  "-h$DATABASE_HOST"
  "-P$DATABASE_PORT"
  "-u$DATABASE_USER"
  "$DATABASE_NAME"
)

MYSQL_PWD="$DATABASE_PASSWORD" "$CLIENT" "${DB_ARGS[@]}" --batch --raw \
  -e "SELECT VERSION() AS version, DATABASE() AS database_name;"
```

Manter o preflight e a operação no mesmo processo `bash`, pois as variáveis e
o array `DB_ARGS` não persistem entre chamadas do terminal.

## Executar consultas e análises

- Tratar a base conectada como a fonte atual do estado dos dados e do schema.
- Para inspeção, preferir `SHOW`, `DESCRIBE` e consultas em
  `information_schema`.
- Para analisar desempenho, usar `EXPLAIN`; não usar `EXPLAIN ANALYZE` sem
  considerar que ele executa a consulta.
- Limitar consultas exploratórias em tabelas grandes com `LIMIT`, filtros
  seletivos e apenas as colunas necessárias. Antes de uma leitura
  potencialmente pesada, verificar índices e estimativa do plano.
- Usar `--batch --raw` para resultados fáceis de analisar. Adicionar `--skip-column-names`
  somente quando o cabeçalho não for útil.
- Não suprimir `stderr`: preservar mensagens e o código de saída do MariaDB.
- Não concatenar entrada não confiável em SQL. Validar identificadores e
  escapar literais conforme as regras do MariaDB.

Exemplo:

```bash
MYSQL_PWD="$DATABASE_PASSWORD" "$CLIENT" "${DB_ARGS[@]}" --batch --raw <<'SQL'
SHOW TABLES;
SELECT *
  FROM information_schema.COLUMNS
 WHERE TABLE_SCHEMA = DATABASE()
 ORDER BY TABLE_NAME, ORDINAL_POSITION
 LIMIT 200;
SQL
```

## Executar alterações solicitadas

Fazer alterações somente quando o pedido do usuário incluir essa ação. Limitar
a operação ao banco `$DATABASE_NAME` e aos objetos ou registros indicados.

1. Inspecionar primeiro o alvo e a condição com uma consulta somente leitura.
2. Para `UPDATE` ou `DELETE`, executar antes um `SELECT` com o mesmo `WHERE` e
   informar ou verificar a quantidade e uma amostra dos registros afetados.
3. Preferir transação explícita para DML em tabelas transacionais. Executar a
   validação dentro da transação e fazer `COMMIT` apenas se o resultado estiver
   correto; em caso de erro, fazer `ROLLBACK`.
4. Verificar o resultado após a alteração com uma nova consulta.
5. Lembrar que DDL e alguns comandos administrativos causam commit implícito no
   MariaDB. Validar o SQL e inspecionar o objeto antes de executar.
6. Para `DROP`, `TRUNCATE`, alteração sem filtro ou outra ação destrutiva, exigir
   que o alvo e a intenção estejam explícitos no pedido. Se estiverem ambíguos,
   parar e pedir confirmação.

Modelo para DML:

```bash
MYSQL_PWD="$DATABASE_PASSWORD" "$CLIENT" "${DB_ARGS[@]}" --batch --raw <<'SQL'
START TRANSACTION;

-- Substituir por SQL validado e estritamente limitado ao pedido.
UPDATE nome_tabela
   SET nome_coluna = 'valor'
 WHERE chave_primaria = 123;

SELECT ROW_COUNT() AS affected_rows;
SELECT *
  FROM nome_tabela
 WHERE chave_primaria = 123;

COMMIT;
SQL
```

Não reutilizar esse modelo mecanicamente: confirmar nomes, tipos, filtros,
constraints e mecanismo da tabela antes da alteração.

## Executar arquivo SQL

Validar o conteúdo e confirmar que o arquivo pertence ao escopo solicitado.
Depois executar:

```bash
SQL_FILE="caminho/validado/arquivo.sql"
MYSQL_PWD="$DATABASE_PASSWORD" "$CLIENT" "${DB_ARGS[@]}" < "$SQL_FILE"
```

Se o arquivo contiver DDL, `DROP`, `TRUNCATE` ou DML amplo, aplicar as mesmas
proteções da seção anterior.

## Regras obrigatórias

- Usar `mariadb`; não substituir por `mysql`, bibliotecas Python ou outro
  cliente.
- Nunca imprimir, registrar ou retornar `DATABASE_PASSWORD`, o conteúdo
  completo do `.env` ou uma linha de comando contendo a senha.
- Não ativar tracing (`set -x`) após carregar o `.env`.
- Passar a senha apenas por `MYSQL_PWD` no ambiente do processo do cliente;
  nunca usar `-pSENHA`.
- Recusar a conexão se `APP_ENVIRONMENT` não indicar desenvolvimento.
- Não alterar outro schema por nome qualificado nem criar uma segunda conexão
  fora das variáveis do `.env`.
- Relatar ao usuário o SQL relevante, o banco/objeto analisado, o resultado e
  quaisquer avisos ou erros, ocultando dados sensíveis.
