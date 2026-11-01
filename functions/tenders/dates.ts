/** Strefa, w której liczymy "dzień" przetargu (użytkownicy są w Polsce, serwer działa w UTC). */
const TIME_ZONE = 'Europe/Warsaw';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** Zamienia znacznik czasu ISO na datę i godzinę w Europe/Warsaw; null dla pustej lub błędnej wartości. */
export const toWarsaw = (iso: string | null | undefined): { date: string; time: string } | null => {
  if (!iso) return null;
  // API eZamówień zwraca 7 cyfr ułamka sekundy; ucinamy do milisekund, by parsowanie było jednoznaczne
  const parsed = new Date(iso.replace(/(\.\d{3})\d+/, '$1'));
  if (isNaN(parsed.getTime())) return null;

  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(parsed)) {
    parts[part.type] = part.value;
  }
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
};

export const todayInWarsaw = (now: Date = new Date()): string => toWarsaw(now.toISOString())!.date;

/** Przesuwa dzień YYYY-MM-DD o podaną liczbę dni (kalendarzowo, bez stref czasowych). */
export const addDays = (day: string, offset: number): string => {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, date + offset)).toISOString().slice(0, 10);
};

export const isValidDay = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && addDays(value, 0) === value;

/** Wyciąga dzień YYYY-MM-DD z wartości TED w rodzaju "2026-10-28+01:00" lub "2026-10-28Z". */
export const dayFromTedDate = (value: unknown): string | null => {
  const first = Array.isArray(value) ? value[0] : value;
  const match = typeof first === 'string' ? first.match(/^(\d{4}-\d{2}-\d{2})/) : null;
  return match ? match[1] : null;
};
