/**
 * Normalizes a legacy date value to the `YYYY-MM-DD` format accepted by MySQL.
 *
 * The DataSnap implementation replaced missing dates with a placeholder date;
 * here missing or empty values become `NULL` so the columns keep their real
 * meaning. Brazilian `DD/MM/YYYY` values are converted as well.
 */
export function toSqlDate(value?: string | null): string | null {
  if (value == null) {
    return null;
  }

  const trimmedValue = value.trim();

  if (trimmedValue === '') {
    return null;
  }

  const brazilianDate = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmedValue);

  if (brazilianDate) {
    return `${brazilianDate[3]}-${brazilianDate[2]}-${brazilianDate[1]}`;
  }

  return trimmedValue;
}
