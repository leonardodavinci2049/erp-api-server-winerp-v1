/**
 * Returns the current timestamp in the requested time zone as ISO 8601 with its UTC offset.
 * Defaults to São Paulo time so the displayed hour matches the local application time.
 */
export function getLocalTimestamp(timeZone = 'America/Sao_Paulo'): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    timeZoneName: 'longOffset',
  })
    .formatToParts(now)
    .reduce<Record<string, string>>((values, part) => {
      values[part.type] = part.value;
      return values;
    }, {});
  const offset = parts.timeZoneName.replace('GMT', '') || '+00:00';

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${String(now.getMilliseconds()).padStart(3, '0')}${offset}`;
}
