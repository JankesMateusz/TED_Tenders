import { ResolverResult } from '../resolver';

/** Stany `tenders/{docId}.docsCheck.state` (plan 3.7). Brak pola `docsCheck` = jeszcze nie sprawdzono. */
export type DocsCheckState = 'none' | 'available' | 'unsupported' | 'profile' | 'error';

/** Część `docsCheck` widoczna w UI i zmieniana przez wynik sprawdzenia (bez metadanych harmonogramu). */
export interface DocsCheckOutcome {
  state: DocsCheckState;
  platform?: string;
  sourceUrl?: string;
  fileCount?: number;
  newestFileAt?: string;
  noticePublishedAt?: string;
}

/** Stany końcowe: dokumentacja znaleziona albo leży tam, gdzie nie potrafimy jej odczytać. Sprawdzanie się kończy. */
export const isTerminalState = (state: DocsCheckState): boolean => state !== 'none' && state !== 'error';

const withoutUndefined = <T extends object>(value: T): T =>
  Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;

/**
 * Mapuje wynik resolvera na stan sprawdzenia. Błąd sieci lub formatu daje `error`, nigdy `none`,
 * żeby awaria platformy nie udawała „brak dokumentów" (plan 3.7, ryzyka).
 */
export const outcomeFromResult = (result: ResolverResult): DocsCheckOutcome => {
  if (result.status === 'RESOLVED') {
    const dates = result.files.map((file) => file.publishedAt).filter((value): value is string => Boolean(value));
    return withoutUndefined({
      state: 'available' as const,
      platform: result.platform,
      sourceUrl: result.sourceUrl,
      fileCount: result.files.length,
      // Daty z platform są w formacie ISO bez strefy lub z nią, porównanie tekstowe wystarcza w obrębie jednej platformy
      newestFileAt: dates.length ? [...dates].sort().at(-1) : undefined,
      noticePublishedAt: result.noticePublishedAt,
    });
  }

  const base = { platform: result.platform, sourceUrl: result.sourceUrl, noticePublishedAt: result.noticePublishedAt };
  switch (result.status) {
    case 'NO_DOCUMENTS_YET':
      return withoutUndefined({ state: 'none' as const, ...base });
    case 'PROFILE_NOT_MATCHED':
      return withoutUndefined({ state: 'profile' as const, ...base });
    // Brak adresu dokumentacji w ogłoszeniu też kończy sprawdzanie: ponowienie niczego nie zmieni
    case 'UNSUPPORTED_PLATFORM':
    case 'NO_SOURCE_URL':
      return withoutUndefined({ state: 'unsupported' as const, ...base });
  }
};

export const errorOutcome = (): DocsCheckOutcome => ({ state: 'error' });

const VISIBLE_KEYS: (keyof DocsCheckOutcome)[] = ['state', 'platform', 'sourceUrl', 'fileCount', 'newestFileAt'];

/** Czy wynik różni się od zapisanego w sposób widoczny dla użytkownika. */
export const outcomeChanged = (previous: Partial<DocsCheckOutcome> | undefined, next: DocsCheckOutcome): boolean =>
  !previous || VISIBLE_KEYS.some((key) => previous[key] !== next[key]);
