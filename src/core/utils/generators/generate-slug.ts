/**
 * Generates a URL-friendly slug from a given string.
 * Handles accented characters (including Portuguese/Brazilian),
 * removes special characters, and replaces spaces with hyphens.
 *
 * @param text - Input string (e.g. product name)
 * @param separator - Word separator (default: '-')
 * @returns Slugified string
 *
 * @example
 * generateSlug('Camiseta Básica Algodão #1')  // 'camiseta-basica-algodao-1'
 * generateSlug('Tênis Corrida Pró')           // 'tenis-corrida-pro'
 */
export function generateSlug(text: string, separator: string = '-'): string {
  return text
    .normalize('NFD') // decompose accented chars (e.g. "ã" → "a" + combining ~)
    .replace(/[\u0300-\u036f]/g, '') // strip combining diacritical marks
    .toLowerCase()
    .replace(/[çÇ]/g, 'c') // handle ç/Ç that survives normalization
    .replace(/[^\w\s-]/g, '') // remove remaining non-word chars (except spaces and hyphens)
    .trim()
    .replace(/[\s_]+/g, separator) // replace whitespace / underscores with separator
    .replace(new RegExp(`${separator}{2,}`, 'g'), separator) // collapse consecutive separators
    .replace(new RegExp(`^${separator}|${separator}$`, 'g'), ''); // trim leading/trailing separator
}
