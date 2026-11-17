---
name: access-development-database-windows
description: Acessa e opera o banco MariaDB de desenvolvimento deste projeto no Windows por meio do mysql2/promise já instalado e das credenciais do .env. Use para consultas, análise de schema, diagnóstico, EXPLAIN, SQL e alterações solicitadas no banco de desenvolvimento.
---

# Acessar o banco de desenvolvimento no Windows

Use o pacote `mysql2/promise` do projeto com uma conexão direta de curta duração.
Isso funciona no Windows e evita depender de um cliente MariaDB instalado à
parte. Execute os comandos a partir da raiz do projeto, onde `dotenv` e `mysql2`
podem ser resolvidos.

## Acesso fora do sandbox

O sandbox deste ambiente Windows bloqueia conexões TCP ao banco. Um erro como
`EACCES` ao conectar ao host e à porta configurados indica esse bloqueio; não
conclua que as credenciais ou o banco estão indisponíveis. Depois de validar
`APP_ENVIRONMENT` e o escopo da operação, solicite a execução do mesmo comando
fora do sandbox com a permissão escalada disponível no ambiente. Faça somente
essa repetição autorizada, preserve a consulta e os parâmetros, e não amplie o
escopo da operação. Se a execução fora do sandbox também falhar, relate o código
de erro sem exibir credenciais.

## Preparar e validar a conexão

Use um arquivo temporário `.mjs` criado na raiz do projeto para cada análise.
Isso permite que Node resolva as dependências do projeto e que o SQL permaneça
fora dos argumentos do processo. Carregue o `.env` com `dotenv/config`, valide
que `APP_ENVIRONMENT` identifica desenvolvimento e passe valores SQL como
parâmetros do `mysql2`.

```js
import 'dotenv/config';
import mysql from 'mysql2/promise';

const environment = (process.env.APP_ENVIRONMENT ?? '').toLowerCase();
if (!['development', 'dev', 'local'].includes(environment)) {
  throw new Error('Connection refused: APP_ENVIRONMENT is not development.');
}

const requiredNames = [
  'DATABASE_HOST',
  'DATABASE_PORT',
  'DATABASE_NAME',
  'DATABASE_USER',
  'DATABASE_PASSWORD',
];
for (const name of requiredNames) {
  if (!process.env[name]) throw new Error(`Required environment variable ${name} is missing.`);
}

const connection = await mysql.createConnection({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  connectTimeout: Number(process.env.DATABASE_CONNECT_TIMEOUT_MS ?? 10000),
});
delete process.env.DATABASE_PASSWORD;

try {
  const [rows] = await connection.query(
    'SELECT VERSION() AS version, DATABASE() AS database_name',
  );
  console.log(JSON.stringify(rows, null, 2));
} finally {
  await connection.end();
}
```

Para executar, crie o arquivo `.mjs` com nome temporário exclusivo na raiz do
projeto, rode `node <arquivo-temporário>.mjs` em PowerShell e remova o arquivo
em um bloco `finally`. Faça esse preflight e a consulta solicitada no mesmo
arquivo e processo. Nunca copie o conteúdo do `.env` para o script.

O pacote `mysql2` aceita queries parametrizadas. Use `connection.query(sql,
params)` para consultas e comandos SQL; não habilite `multipleStatements`.

## Consultas e análises

- Trate a base conectada como a fonte atual do estado dos dados e do schema.
- Prefira `SHOW`, `DESCRIBE` e consultas em `information_schema` para inspeção.
- Use `EXPLAIN` para avaliar consultas; `EXPLAIN ANALYZE` executa a consulta.
- Limite leituras exploratórias em tabelas grandes. Antes de uma leitura
  potencialmente pesada, confira índices e estimativa do plano.
- Exiba somente as colunas e linhas necessárias.
- Preserve erros úteis sem imprimir o objeto de erro completo, que pode incluir
  detalhes de conexão. Relate o código do driver quando disponível.
- Não concatene entrada não confiável em SQL. Valide identificadores e escape
  literais de acordo com as regras MariaDB.
- Use `connection.query(sql, params)` e placeholders `?` para valores. Não monte
  SQL por interpolação de valores recebidos do usuário; nomes de tabelas e
  colunas precisam ser validados separadamente, pois placeholders não servem
  para identificadores.

## Alterações solicitadas

Faça alterações somente quando o pedido do usuário incluir essa ação. Limite a
operação a `process.env.DATABASE_NAME` e aos objetos ou registros indicados.

1. Inspecione o alvo e a condição com uma consulta somente leitura.
2. Antes de `UPDATE` ou `DELETE`, execute um `SELECT` com o mesmo `WHERE` e
   verifique a quantidade e uma amostra dos registros afetados.
3. Prefira transação explícita para DML em tabelas transacionais. Valide o
   resultado dentro da transação e faça `COMMIT` apenas se estiver correto;
   em caso de erro, faça `ROLLBACK`.
4. Consulte novamente após a alteração.
5. Considere que DDL e comandos administrativos podem causar commit implícito.
6. Para `DROP`, `TRUNCATE`, alterações sem filtro ou outra ação destrutiva,
   exija que alvo e intenção estejam explícitos no pedido. Se estiverem
   ambíguos, pare e peça confirmação.

## Transações

Para uma alteração autorizada, use `connection.beginTransaction()`, execute
cada instrução como query separada com parâmetros, valide o resultado, e então
faça `commit()`. Em qualquer erro, faça `rollback()` antes de propagar a falha.
Sempre encerre a conexão em `finally`.

## Regras obrigatórias

- Use o `mysql2/promise` que já é dependência do projeto; não instale nem dependa
  de cliente externo ou de servidor MariaDB local.
- Nunca imprima, registre ou retorne `DATABASE_PASSWORD`, o conteúdo completo
  do `.env` ou um comando contendo a senha.
- Nunca imprima a configuração da conexão nem o objeto completo de erro do
  driver. O processo deve terminar após o trabalho, e a conexão deve ser
  encerrada em `finally`.
- Recuse a conexão se `APP_ENVIRONMENT` não indicar desenvolvimento.
- Não altere outro schema por nome qualificado nem abra conexões diferentes das
  definidas pelo `.env`.
- Relate o SQL relevante, o banco/objeto analisado, o resultado e avisos ou
  erros, ocultando dados sensíveis.
