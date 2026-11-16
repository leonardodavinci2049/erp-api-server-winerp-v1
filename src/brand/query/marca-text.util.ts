/** Matches the legacy StringReplace for JSON text fields. */
export function normalizeMarcaText(value: string): string {
  return value.replace(/null/gi, '');
}
