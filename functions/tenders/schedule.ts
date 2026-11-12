import { addDays, toWarsaw } from './dates';

/** Godzina (czas warszawski), w której przebiegi harmonogramu domykają poprzedni dzień zamiast odświeżać bieżący. */
const FINALIZE_HOUR = 0;

export interface ScheduledRefreshTarget {
  /** Dzień YYYY-MM-DD do odświeżenia w tym przebiegu. */
  day: string;
  /** True, gdy to domknięcie dnia, który już się skończył (dziennik dostaje wtedy `complete: true`). */
  finalizing: boolean;
}

/**
 * Wybiera dzień dla przebiegu harmonogramu. W ciągu dnia odświeżamy dzisiejszy, a w godzinie po północy
 * poprzedni: dopiero pobranie po jego zakończeniu oznacza dzień w dzienniku jako kompletny, a nikt inny
 * tego nie robi, dopóki ktoś nie otworzy tego dnia w aplikacji.
 */
export const scheduledRefreshTarget = (now: Date = new Date()): ScheduledRefreshTarget => {
  const warsaw = toWarsaw(now.toISOString())!;
  const hour = Number(warsaw.time.slice(0, 2));
  return hour === FINALIZE_HOUR
    ? { day: addDays(warsaw.date, -1), finalizing: true }
    : { day: warsaw.date, finalizing: false };
};
