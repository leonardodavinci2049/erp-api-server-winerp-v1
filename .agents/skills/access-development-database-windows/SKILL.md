---
name: access-development-database-windows
description: Acessa o MariaDB de desenvolvimento deste projeto no Windows usando mysql2/promise e o .env local. Use para consultas, inspeção de schema, diagnóstico, EXPLAIN e CRUD solicitado em tabelas (INSERT, SELECT, UPDATE e DELETE), além de SQL e stored procedures.
---

# Acessar o banco de desenvolvimento no Windows

Use o `mysql2/promise` já instalado no projeto com uma conexão direta de curta
duração. Execute a partir da raiz do repositório, sem instalar cliente MariaDB
ou servidor local. Esta skill orienta operações no banco; implementar endpoints
continua sujeito à arquitetura NestJS e às instruções do projeto.

## Escopo e autorização

- Consultas e inspeções podem preceder uma alteração para definir seu alvo.
  Faça escritas somente quando solicitadas; revisar esta skill não autoriza
  inserir, alterar ou excluir dados para testá-la.
- Um pedido explícito de CRUD com alvo e valores definidos autoriza a operação
  correspondente. Não peça nova confirmação por rotina. Se faltarem dados
  essenciais, esclareça-os antes de escrever.
- Antes de qualquer escrita, informe tabela, filtro, tenant/loja, quantidade
  esperada e efeitos conhecidos, sem revelar valores sensíveis.
- `DROP`, `TRUNCATE`, exclusões em massa, DDL destrutivo e correções de dados
  exigem autorização explícita conforme o `AGENTS.md`. Não amplie uma exclusão
  pontual nem trate um pedido de análise como autorização de correção.
- Restrinja operações ao schema do `.env`. Não use nomes qualificados para
  escrever em outro schema nem altere credenciais, permissões ou ambiente.

## Preparar e validar a conexão

Crie um arquivo temporário `.mjs` de nome exclusivo na raiz do projeto para que
Node resolva as dependências. Use uma here-string literal do PowerShell (`@'`
e `'@`) ao gerar o conteúdo, evitando expansão de `$` e crases do JavaScript.
Execute `node <arquivo-temporário>.mjs`; confira `$LASTEXITCODE`. Remova somente
esse arquivo com `Remove-Item -LiteralPath` em `finally`, depois da execução e
de eventual repetição autorizada. Não versione o script nem copie segredos para ele.

O exemplo lê o `.env` local diretamente, sem herdar credenciais de outra sessão.
`APP_ENVIRONMENT` é uma proteção desta skill; não é validado pelo schema atual
de `src/core/config/envs.ts`. Se estiver ausente ou não indicar desenvolvimento,
interrompa e solicite esclarecimento; não invente nem altere o valor para conectar.

```js
import { readFileSync } from 'node:fs';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

let connection;
let failed = false;

function reportError(error) {
  const code = typeof error?.code === 'string' ? error.code : 'LOCAL_FAILURE';
  console.error(JSON.stringify({ status: 'failed', code }));
}

try {
  const env = dotenv.parse(readFileSync('.env', 'utf8'));
  const environment = (env.APP_ENVIRONMENT ?? '').trim().toLowerCase();
  if (!['development', 'dev', 'local'].includes(environment)) {
    throw Object.assign(new Error('Development environment required.'), {
      code: 'INVALID_DEVELOPMENT_ENVIRONMENT',
    });
  }
  const requiredNames = [
    'DATABASE_HOST',
    'DATABASE_PORT',
    'DATABASE_NAME',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
  ];
  if (requiredNames.some((name) => !env[name])) {
    throw Object.assign(new Error('Database configuration is incomplete.'), {
      code: 'INVALID_DATABASE_CONFIGURATION',
    });
  }
  const port = Number(env.DATABASE_PORT);
  const connectTimeout = Number(env.DATABASE_CONNECT_TIMEOUT_MS ?? 10000);
  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !Number.isSafeInteger(connectTimeout) ||
    connectTimeout <= 0
  ) {
    throw Object.assign(new Error('Invalid connection limits.'), {
      code: 'INVALID_CONNECTION_LIMITS',
    });
  }
  connection = await mysql.createConnection({
    host: env.DATABASE_HOST,
    port,
    database: env.DATABASE_NAME,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    connectTimeout,
    multipleStatements: false,
    supportBigNumbers: true,
    bigNumberStrings: true,
  });
  delete env.DATABASE_PASSWORD;

  const [[identity]] = await connection.query(
    'SELECT DATABASE() AS database_name',
  );
  if (identity.database_name !== env.DATABASE_NAME) {
    throw Object.assign(new Error('Unexpected database.'), {
      code: 'DATABASE_MISMATCH',
    });
  }
  // Run the scoped inspection or authorized operation here.
  console.log(JSON.stringify({ status: 'connected', databaseVerified: true }));
} catch (error) {
  failed = true;
  reportError(error);
} finally {
  if (connection) {
    try {
      await connection.end();
    } catch (error) {
      failed = true;
      reportError(error);
    }
  }
  if (failed) process.exitCode = 1;
}
```

Faça a validação da conexão e a operação no mesmo processo. O timeout acima
limita apenas o estabelecimento da conexão, não o tempo de execução do SQL.
Nunca imprima o `.env`, sua configuração, `error.message`, `error.sql`,
`error.sqlMessage`, stack trace ou o objeto de erro completo. Capture também
falhas de conexão e de encerramento, como no exemplo.

## Sandbox e falhas de execução

O sandbox pode bloquear TCP ou a criação do arquivo em um diretório protegido.
Em falha compatível com essa restrição, como `EACCES` ao conectar, solicite a
permissão escalada disponível e repita o comando preservando consulta e
parâmetros. Esse erro sugere uma restrição; sozinho não prova sua causa.
Não mude host, porta, credenciais ou controles de segurança para contorná-la.
Se a execução autorizada também falhar, relate o código sanitizado e a etapa.

Só repita automaticamente uma escrita se houver certeza de que não chegou ao
servidor, por exemplo, falha no estabelecimento da conexão. Perda de conexão
durante DML ou `COMMIT` deixa o resultado possivelmente indeterminado: consulte
o estado em uma nova conexão ao mesmo banco antes de decidir qualquer repetição.
Não declare rollback bem-sucedido se ele também falhou.

## Inspeção e isolamento

1. Inspecione a tabela real: colunas, tipos, nulabilidade, defaults, chave
   primária, índices únicos, engine, chaves estrangeiras e triggers. Use
   `SHOW CREATE TABLE`, `SHOW INDEX` e `information_schema`, restringindo
   metadados ao schema conectado. Não execute `SHOW GRANTS` sem necessidade.
2. Identifique como `pe_system_client_id` e `pe_store_id` correspondem às
   colunas da tabela ou aos relacionamentos. Esses nomes de parâmetros não
   provam nomes de colunas. Preserve o tenant e a loja em leituras, escritas e
   verificações. Se a tabela depender do tenant de uma tabela pai, valide essa
   relação; não a trate como global por não ter colunas próprias de tenant.
3. Examine dependências e efeitos: cascatas, auditoria, exclusão lógica e
   regras de negócio/procedures existentes. Não desabilite chaves estrangeiras
   nem triggers para forçar sucesso. Não substitua uma operação de negócio
   complexa por DML direto sem verificar seus efeitos e o escopo solicitado.
4. Para leitura exploratória, escolha colunas necessárias, filtro e `LIMIT`;
   use ordenação estável quando relevante. Verifique plano e índices para
   consultas grandes. `EXPLAIN` analisa o plano; comandos de análise que
   executam a consulta não são uma inspeção inofensiva.

Use `connection.execute(sql, params)` para CRUD com valores escalares e
placeholders `?`. `connection.query(sql, params)` também está disponível para
metadados e comandos não suportados como prepared statements. Nunca interpole
valores no SQL, passe `undefined` ou habilite `multipleStatements`.
Para opcionais, use `?? null` apenas quando `NULL` for a intenção; omita a coluna
de um `INSERT` para usar seu default e omita de `SET` campos não solicitados.
Não converta identificadores `BIGINT` ou valores decimais em `Number` se houver
perda de precisão. Prefira strings nesses casos.

Placeholders `?` representam valores, não tabelas/colunas. Prefira nomes fixos
verificados no schema; se precisar de identificadores dinâmicos, valide-os
contra os objetos autorizados e use `mysql.escapeId` em cada identificador.
Escape não substitui a validação do schema e do escopo autorizado.

## CRUD solicitado

Os exemplos abaixo são ilustrativos, não descrevem uma tabela existente.
Adapte nomes e valores ao schema inspecionado e ao pedido; não execute as quatro
operações em sequência como teste. `tenantId`, `storeId`, `recordId` e `name`
devem vir do escopo autorizado. O exemplo supõe tabela transacional `example_record`
com chave `id`, colunas `system_client_id`, `store_id` e `name`.

| Operação          | Preparação e conferência                                                                                                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Create (`INSERT`) | Liste colunas explicitamente, preencha obrigatórias e tenant/loja, respeite defaults e unicidade. Valide `affectedRows` e releia pela chave; use `insertId` somente para chave auto incrementada. Não use `REPLACE`, `INSERT IGNORE` ou upsert sem que essa semântica tenha sido solicitada. |
| Read (`SELECT`)   | Filtre por tenant/loja e pelos critérios pedidos. Se não houver resultado, informe isso sem retirar filtros para procurar em outros tenants.                                                                                                                                                 |
| Update (`UPDATE`) | Faça um `SELECT` prévio com o mesmo `WHERE`; confira quantidade e valores atuais. Altere apenas campos solicitados. Uma atualização para o valor já existente pode não modificar dados; confira o estado final, não apenas o contador.                                                       |
| Delete (`DELETE`) | Faça a mesma prévia, verifique dependências/cascatas e a convenção de exclusão lógica. Exclua fisicamente apenas quando isso corresponder ao pedido. Confirme quantidade e ausência pela mesma chave e tenant/loja.                                                                          |

```js
const [created] = await connection.execute(
  'INSERT INTO example_record (system_client_id, store_id, name) VALUES (?, ?, ?)',
  [tenantId, storeId, name],
);
const [rows] = await connection.execute(
  'SELECT id, name FROM example_record WHERE system_client_id = ? AND store_id = ? AND id = ?',
  [tenantId, storeId, recordId],
);
const [updated] = await connection.execute(
  'UPDATE example_record SET name = ? WHERE system_client_id = ? AND store_id = ? AND id = ?',
  [name, tenantId, storeId, recordId],
);
const [deleted] = await connection.execute(
  'DELETE FROM example_record WHERE system_client_id = ? AND store_id = ? AND id = ?',
  [tenantId, storeId, recordId],
);
```

Em `INSERT`, `UPDATE` e `DELETE`, o primeiro item retornado é um cabeçalho de
resultado (`affectedRows`, `insertId`), não um array de linhas. Em `SELECT`, é
o array de linhas. Defina a quantidade esperada antes de escrever; se ela
divergir, interrompa e reverta quando possível. Um `LIMIT 1` não substitui um
filtro correto nem deve esconder múltiplos registros inesperados.

## Transações e verificação

Para DML em tabelas transacionais, use a mesma conexão para `beginTransaction()`,
leitura de confirmação, escrita, verificação e `commit()`. Faça a prévia e
comunique o impacto antes de abrir a transação; não mantenha locks enquanto
aguarda resposta humana. Dentro dela, revalide os registros com
`SELECT ... FOR UPDATE` pelo filtro indexado antes de `UPDATE`/`DELETE`, ou
use controle otimista equivalente. Interrompa se o alvo/estado tiver mudado.

```js
await connection.beginTransaction();
try {
  // Recheck the authorized target, then run only the requested DML.
  // Verify row counts and final values before committing.
  await connection.commit();
} catch (error) {
  try {
    await connection.rollback();
  } catch (rollbackError) {
    reportError(rollbackError);
  }
  throw error; // Caught by the outer handler; never print the raw error.
}
```

Insira esse bloco no `try` da conexão, substituindo os comentários pela operação
e pelas verificações concretas. Depois do `COMMIT`, releia as colunas necessárias
com o mesmo escopo. Informe separadamente falha na conferência posterior e
falha na escrita; a primeira não desfaz o commit nem autoriza repetir a escrita.

Rollback só protege mudanças transacionais. Verifique também as tabelas
alcançadas por triggers/cascatas; para engines não transacionais, explique a
limitação e defina recuperação antes de escrever. Não faça testes destrutivos
presumindo que rollback desfará tudo. DDL/comandos administrativos podem causar
commit implícito e devem ficar separados do CRUD transacional.

Para `CALL`, confira assinatura, ordem dos parâmetros e result sets no banco.
As procedures deste projeto controlam suas transações; não suponha que uma
transação externa possa desfazer uma procedure que executou `COMMIT`.

## Entrega

Relate operação, tabela, escopo sanitizado, SQL com placeholders, quantidade
esperada/afetada, verificação final e status do commit ou rollback. Oculte
credenciais e valores sensíveis; não copie valores do `.env` para o relatório.
Distinga validação estática, conexão/leitura real e CRUD efetivamente executado.
Não declare capacidade de escrita comprovada apenas porque um `SELECT` funcionou;
o usuário do banco também precisa dos privilégios correspondentes.

Referências para detalhes de [prepared statements do MySQL2](https://sidorares.github.io/node-mysql2/docs/examples/queries/prepared-statements)
e [transações do MariaDB](https://mariadb.com/docs/server/reference/sql-statements/transactions/start-transaction).
