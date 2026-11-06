import { addDays, toWarsaw } from '../../tenders/dates';

/** Okno sprawdzeń (czas Europe/Warsaw, D15 z oknem przesuniętym przez właściciela): od 9:00 do północy. */
export const WINDOW_START_HOUR = 9;
/** Najwyżej tyle sprawdzeń na przetarg (pierwsze + 5 ponowień). */
export const MAX_CHECKS = 6;

const HOUR_MS = 60 * 60 * 1000;
/** Godziny kolejnych sprawdzeń następnego dnia roboczego (po czwartym sprawdzeniu). */
const NEXT_DAY_HOURS = [9, 12];

/** Chwila UTC, w której w Warszawie jest podany dzień (YYYY-MM-DD) i pełna godzina. */
export const warsawWallClockToUtc = (day: string, hour: number): Date => {
  const [year, month, date] = day.split('-').map(Number);
  const target = Date.UTC(year, month - 1, date, hour);
  let utc = target;
  // Dwie iteracje wystarczą, by uwzględnić przesunięcie czasu letniego/zimowego w danym dniu
  for (let i = 0; i < 2; i++) {
    const wall = toWarsaw(new Date(utc).toISOString())!;
    const [wy, wm, wd] = wall.date.split('-').map(Number);
    const [wh, wmin] = wall.time.split(':').map(Number);
    utc += target - Date.UTC(wy, wm - 1, wd, wh, wmin);
  }
  return new Date(utc);
};

const isWorkingDay = (day: string): boolean => {
  const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
  return weekday !== 0 && weekday !== 6;
};

const nextWorkingDay = (day: string): string => {
  let next = addDays(day, 1);
  while (!isWorkingDay(next)) next = addDays(next, 1);
  return next;
};

/** Przesuwa moment przed 9:00 na 9:00 tego samego dnia; godziny 9:00-23:59 zostają bez zmian. */
export const clampToWindow = (moment: Date): Date => {
  const wall = toWarsaw(moment.toISOString())!;
  const hour = Number(wall.time.slice(0, 2));
  return hour < WINDOW_START_HOUR ? warsawWallClockToUtc(wall.date, WINDOW_START_HOUR) : moment;
};

export const isInsideWindow = (moment: Date): boolean => clampToWindow(moment).getTime() === moment.getTime();

/** Kiedy wykonać pierwsze sprawdzenie nowego przetargu. */
export const firstCheckTime = (now: Date): Date => clampToWindow(now);

/**
 * Kiedy wykonać kolejne sprawdzenie, gdy właśnie zakończono `completedChecks`-te (liczone od 1).
 * Harmonogram: +1 h, +2 h, +4 h, potem następny dzień roboczy o 9:00 i 12:00. Zwraca null po ostatnim sprawdzeniu.
 */
export const nextCheckTime = (completedChecks: number, now: Date): Date | null => {
  if (completedChecks >= MAX_CHECKS) return null;
  if (completedChecks >= 1 && completedChecks <= 3) {
    return clampToWindow(new Date(now.getTime() + 2 ** (completedChecks - 1) * HOUR_MS));
  }

  // Sprawdzenie nr 4 przechodzi na następny dzień roboczy 9:00; nr 5 tego samego dnia o 12:00 (lub godzinę później, gdy już po 12:00)
  const today = toWarsaw(now.toISOString())!.date;
  if (completedChecks === 4) return warsawWallClockToUtc(nextWorkingDay(today), NEXT_DAY_HOURS[0]);
  const noon = warsawWallClockToUtc(today, NEXT_DAY_HOURS[1]);
  return noon.getTime() > now.getTime() ? noon : clampToWindow(new Date(now.getTime() + HOUR_MS));
};
