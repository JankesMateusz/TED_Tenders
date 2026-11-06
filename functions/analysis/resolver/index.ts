import { ezamowieniaAdapter, extractProceedingUrl, noticeObjectId, resolveNotice } from './ezamowienia';
import { bazaAdapter } from './bazakonkurencyjnosci';
import { createHttpClient } from './httpClient';
import { platformazakupowaAdapter } from './platformazakupowa';
import { HttpClient, PlatformAdapter, ResolverResult, TenderContext } from './types';

export * from './types';

/** Adaptery dopasowywane do adresu dokumentacji (adresy się nie nakładają, kolejność nie ma znaczenia). */
export const ADAPTERS: PlatformAdapter[] = [ezamowieniaAdapter, platformazakupowaAdapter, bazaAdapter];

/** Adres dokumentacji → adapter; brak dopasowania = platforma nieobsługiwana (ręczne wgranie plików). */
const resolveByUrl = async (url: string, http: HttpClient): Promise<ResolverResult> => {
  const adapter = ADAPTERS.find((candidate) => candidate.matches(url));
  if (adapter) return adapter.resolve(url, http);
  return { status: 'UNSUPPORTED_PLATFORM', sourceUrl: url, note: 'Dokumentacja leży na platformie, której nie obsługujemy automatycznie.' };
};

/**
 * Ustala, gdzie leży dokumentacja przetargu i jakie ma pliki (manifest). Niczego nie pobiera ani nie zapisuje.
 * Błędy sieci to wyjątek `ResolverError`.
 *
 * - E_ZAMOWIENIA: objectId z linku → metadane → lista dokumentów; przy pustej liście sprawdza pole 3.1 ogłoszenia.
 * - TED: `documentsUrl` → adapter dopasowany do adresu.
 * - BAZA_KONKURENCYJNOSCI: `link` ogłoszenia → szczegóły w API Bazy → `attachments[]`.
 */
export const resolveDocuments = async (tender: TenderContext, http: HttpClient = createHttpClient()): Promise<ResolverResult> => {
  if (tender.source === 'E_ZAMOWIENIA') {
    const objectId = noticeObjectId(tender.link);
    if (!objectId) return { status: 'NO_SOURCE_URL', note: 'Nie udało się odczytać identyfikatora ogłoszenia z linku.' };

    return resolveNotice(objectId, http, async (html, empty) => {
      const proceedingUrl = extractProceedingUrl(html);
      if (!proceedingUrl) return { status: 'NO_SOURCE_URL', note: 'W ogłoszeniu nie ma adresu strony prowadzonego postępowania.' };
      // Adres wskazuje na same eZamówienia: dokumentacja leży tam, tylko jeszcze jej nie dodano
      if (new URL(proceedingUrl).hostname.endsWith('ezamowienia.gov.pl')) return empty;
      return resolveByUrl(proceedingUrl, http);
    });
  }

  if (tender.source === 'TED') {
    if (!tender.documentsUrl) return { status: 'NO_SOURCE_URL', note: 'Ogłoszenie z TED nie podaje adresu dokumentacji.' };
    return resolveByUrl(tender.documentsUrl, http);
  }

  if (tender.source === 'BAZA_KONKURENCYJNOSCI') {
    if (!bazaAdapter.matches(tender.link)) return { status: 'NO_SOURCE_URL', note: 'Nie udało się odczytać adresu ogłoszenia w Bazie Konkurencyjności.' };
    return bazaAdapter.resolve(tender.link, http);
  }

  return { status: 'UNSUPPORTED_PLATFORM', note: 'Nieznane źródło przetargu.' };
};
