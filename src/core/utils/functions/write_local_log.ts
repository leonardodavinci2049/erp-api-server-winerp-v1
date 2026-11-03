import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type LocalLogLevel = 'info' | 'warn' | 'error';

const dateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Sao_Paulo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/**
 * Serializes concurrent writes so the array read from disk matches the array
 * written back. Chained promises run tasks one at a time in call order.
 */
let pending: Promise<unknown> = Promise.resolve();

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = pending.then(task, task);
  pending = run.catch(() => undefined);
  return run;
}

/**
 * Builds a JSON-safe object from raw entry data, converting bigint and Error
 * values, breaking circular references and replacing undefined with null.
 */
function createReplacer() {
  const seen = new WeakSet<object>();
  return (_key: string, value: unknown): unknown => {
    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (value !== null && typeof value === 'object') {
      if (seen.has(value)) {
        return '[Circular or repeated reference]';
      }
      seen.add(value);

      if (value instanceof Error) {
        return { name: value.name, message: value.message };
      }
    }

    return value === undefined ? null : value;
  };
}

/**
 * Interprets the existing log content as an array of entries. Handles an empty
 * file, a single object, an array and, as a fallback, the legacy format with
 * one JSON object per line. Entries that cannot be parsed are skipped.
 */
function resolveExistingEntries(raw: string): unknown[] {
  const text = raw.trim();
  if (!text) {
    return [];
  }

  try {
    const parsed = JSON.parse(text) as unknown;
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // Legacy one-object-per-line format: recover each valid line.
    const recovered: unknown[] = [];
    for (const line of text.split('\n')) {
      const candidate = line.trim().replace(/,$/, '');
      if (!candidate) {
        continue;
      }
      try {
        recovered.push(JSON.parse(candidate) as unknown);
      } catch {
        // Skip lines that cannot be recovered.
      }
    }
    return recovered;
  }
}

/**
 * Adds one entry to the JSON array in logs/log-YYYY-MM-DD.log at the project
 * root. The file always stays a valid, pretty-printed JSON array of entry
 * objects, so it can be read and formatted by the editor without manual edits:
 * each call simply appends a new object to the existing array.
 * Requires the Node.js runtime. Await the call before ending the request.
 * Pass only selected diagnostic data, never credentials or full requests.
 * Returns false when serialization or writing fails.
 */
export async function writeLocalLog(
  subject: string,
  notes: unknown,
  level: LocalLogLevel = 'info',
): Promise<boolean> {
  try {
    const now = new Date();
    const parts = dateFormatter.formatToParts(now);
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    const day = parts.find((part) => part.type === 'day')?.value;
    const directory = path.join(process.cwd(), 'logs');
    const file = path.join(directory, `log-${year}-${month}-${day}.log`);
    const replacer = createReplacer();

    return await enqueue(async () => {
      // Serialize the entry first so serialization failures skip the write.
      const entry = JSON.parse(
        JSON.stringify(
          { timestamp: now.toISOString(), level, subject, notes },
          replacer,
        ),
      ) as unknown;

      const raw = await readFile(file, 'utf8').catch(() => '');
      const entries = resolveExistingEntries(raw);
      entries.push(entry);

      await mkdir(directory, { recursive: true, mode: 0o700 });
      await writeFile(file, `${JSON.stringify(entries, replacer, 2)}\n`, {
        encoding: 'utf8',
        mode: 0o600,
      });
      return true;
    });
  } catch {
    console.warn('[writeLocalLog] Unable to write local diagnostic log.');
    return false;
  }
}
