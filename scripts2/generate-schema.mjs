import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createPool } from "mysql2/promise";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPT_ROOT = resolve(__dirname, "..");
// Usa o diretorio de onde o comando foi invocado, para funcionar via symlink
// em projetos consumidores. Fallback para o diretorio do script quando nao ha
// .env no cwd (ex.: execucao direta dentro do projeto base).
const CWD = process.cwd();
const ROOT =
  existsSync(resolve(CWD, ".env")) || existsSync(resolve(CWD, ".env.local"))
    ? CWD
    : SCRIPT_ROOT;

// ─── CONFIG ──────────────────────────────────────────────────────────────────

const SCHEMA_OUTPUT_DIR = resolve(ROOT, "database/schemas");

// ─── ENV ─────────────────────────────────────────────────────────────────────

function loadEnv() {
  const envFiles = [".env", ".env.local"];
  const vars = {};

  for (const file of envFiles) {
    try {
      const content = readFileSync(resolve(ROOT, file), "utf-8");
      for (const line of content.split("\n")) {
        let trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        if (trimmed.startsWith("export ")) trimmed = trimmed.slice(7).trim();
        const eqIndex = trimmed.indexOf("=");
        if (eqIndex === -1) continue;
        const key = trimmed.slice(0, eqIndex).trim();
        let value = trimmed.slice(eqIndex + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
          (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
        ) {
          value = value.slice(1, -1);
        }
        if (key) vars[key] = value;
      }
    } catch {
      // arquivo nao encontrado, ignorar
    }
  }

  // Variaveis exportadas no shell tem precedencia sobre os arquivos.
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined && value !== "") {
      vars[key] = value;
    }
  }

  return vars;
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  const env = loadEnv();

  const requiredVars = [
    "DATABASE_HOST",
    "DATABASE_PORT",
    "DATABASE_NAME",
    "DATABASE_USER",
    "DATABASE_PASSWORD",
  ];
  for (const key of requiredVars) {
    if (!env[key]) {
      console.error(`Variavel de ambiente ausente: ${key}`);
      process.exit(1);
    }
  }

  mkdirSync(SCHEMA_OUTPUT_DIR, { recursive: true });

  if (existsSync(SCHEMA_OUTPUT_DIR)) {
    const existingFiles = readdirSync(SCHEMA_OUTPUT_DIR).filter(
      (f) => f.endsWith(".sql") || f.endsWith(".md"),
    );
    if (existingFiles.length > 0) {
      console.log(
        `Limpando ${existingFiles.length} arquivo(s) existente(s) em ${SCHEMA_OUTPUT_DIR}...`,
      );
      for (const file of existingFiles) {
        unlinkSync(resolve(SCHEMA_OUTPUT_DIR, file));
      }
    }
  }

  const pool = createPool({
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT),
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    connectionLimit: 2,
  });

  try {
    console.log(
      `Conectando a ${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}...`,
    );

    const [tables] = await pool.query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_TYPE = 'BASE TABLE'
       ORDER BY TABLE_NAME`,
      [env.DATABASE_NAME],
    );

    console.log(`Encontradas ${tables.length} tabelas`);

    for (const table of tables) {
      const tableName = table.TABLE_NAME;

      const [rows] = await pool.query(`SHOW CREATE TABLE \`${tableName}\``);

      const createTableStmt = rows[0]["Create Table"];

      const filePath = resolve(SCHEMA_OUTPUT_DIR, `${tableName}.sql`);
      writeFileSync(filePath, `${createTableStmt};\n`, "utf-8");
      console.log(`  -> ${tableName}.sql`);
    }

    console.log(`\nSchemas gerados em: ${SCHEMA_OUTPUT_DIR}`);
    console.log(`Total: ${tables.length} arquivos`);

    // ── INDEX MD ──────────────────────────────────────────────────────────

    const indexLines = [
      `# Index - Schemas do Banco \`${env.DATABASE_NAME}\``,
      "",
      "| # | Tabela | Arquivo |",
      "|---|--------|---------|",
    ];

    tables.forEach((table, i) => {
      const name = table.TABLE_NAME;
      indexLines.push(
        `| ${i + 1} | \`${name}\` | [${name}.sql](./${name}.sql) |`,
      );
    });

    indexLines.push("");
    indexLines.push(`**Total de tabelas:** ${tables.length}`);

    const indexPath = resolve(SCHEMA_OUTPUT_DIR, "index.md");
    writeFileSync(indexPath, `${indexLines.join("\n")}\n`, "utf-8");
    console.log(`  -> index.md gerado`);
  } catch (err) {
    console.error("Erro:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
