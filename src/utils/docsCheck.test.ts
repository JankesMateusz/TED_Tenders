import { Tender } from '../types/Tender';
import { TenderSource } from '../types/TenderSource';
import { DocsCheck } from '../types/DocsCheck';
import { docsBadge, docsFilterOf, docsLinkUrl, formatCheckTime, platformName, pluralizeFiles, toPublicEzamowieniaUrl } from './docsCheck';
import { favoriteFromDoc, favoriteToDoc, tenderFromDoc } from './tenderMapping';

const NOW = new Date(2026, 10, 9, 11, 0); // poniedziałek 11:00, czas lokalny

const tender = (extra: Partial<Tender> = {}): Tender => ({
    id: 'a',
    publicationNumber: 'a',
    title: 'Laptopy',
    buyerName: 'Urząd',
    buyerCity: 'Kraków',
    publicationDate: '09-11-2026',
    deadlineDate: '20-11-2026',
    cpvCodes: [],
    link: 'https://example.com',
    source: TenderSource.E_ZAMOWIENIA,
    ...extra
});
const withCheck = (docsCheck: DocsCheck): Tender => tender({ isIT: true, docsCheck });
const at = (hours: number, minutes = 0, dayOffset = 0) => new Date(2026, 10, 9 + dayOffset, hours, minutes);

describe('docsBadge', () => {
    it('przetarg spoza IT bez wyniku nie ma plakietki', () => {
        expect(docsBadge(tender(), NOW)).toBeNull();
    });

    it('świeży przetarg IT bez wyniku: „sprawdzam", starszy: „nie były sprawdzane"; oba pozwalają sprawdzić teraz', () => {
        const fresh = docsBadge(tender({ isIT: true, fetchedAt: new Date(NOW.getTime() - 5 * 60 * 1000) }), NOW)!;
        expect(fresh.text).toBe('📄 sprawdzam dokumenty…');
        const old = docsBadge(tender({ isIT: true, fetchedAt: new Date(NOW.getTime() - 3 * 3600 * 1000) }), NOW)!;
        expect(old.text).toBe('📄 dokumenty nie były sprawdzane');
        expect(fresh.canCheckNow && old.canCheckNow).toBe(true);
    });

    it('dostępne: liczba plików z odmianą i platforma, bez „Sprawdź teraz"', () => {
        const badge = docsBadge(withCheck({ state: 'available', platform: 'ezamowienia', fileCount: 5, sourceUrl: 'https://ezamowienia.gov.pl/x' }), NOW)!;
        expect(badge.text).toBe('📄 5 plików · eZamówienia');
        expect(badge.canCheckNow).toBe(false);
        expect(docsBadge(withCheck({ state: 'available', platform: 'platformazakupowa', fileCount: 1 }), NOW)!.text).toBe('📄 1 plik · platformazakupowa.pl');
        expect(docsBadge(withCheck({ state: 'available', platform: 'ezamowienia', fileCount: 3 }), NOW)!.text).toContain('3 pliki');
    });

    it('brak dokumentów z zaplanowanym sprawdzeniem pokazuje jego godzinę, a po zakończeniu godzinę ostatniego', () => {
        const waiting = docsBadge(withCheck({ state: 'none', checks: 2, checkedAt: at(10, 42), nextCheckAt: at(12, 42) }), NOW)!;
        expect(waiting.text).toBe('📄 brak dokumentów · następne sprawdzenie 12:42');
        expect(waiting.canCheckNow).toBe(true);
        expect(waiting.tone).toBe('warn');

        const finished = docsBadge(withCheck({ state: 'none', checks: 6, checkedAt: at(9, 5) }), NOW)!;
        expect(finished.text).toBe('📄 brak dokumentów · sprawdzono 09:05');
        expect(finished.title).toContain('zakończone');
    });

    it('następne sprawdzenie innego dnia ma datę', () => {
        const badge = docsBadge(withCheck({ state: 'none', checkedAt: at(22, 10), nextCheckAt: at(9, 0, 1) }), NOW)!;
        expect(badge.text).toMatch(/następne sprawdzenie 10\.11 09:00$/);
    });

    it('platforma nieobsługiwana lub profil: nazwa platformy z adresu, bez „Sprawdź teraz"', () => {
        const badge = docsBadge(withCheck({ state: 'unsupported', sourceUrl: 'https://www.ezamawiajacy.pl/postepowanie/1' }), NOW)!;
        expect(badge.text).toBe('📄 dokumenty na ezamawiajacy.pl');
        expect(badge.canCheckNow).toBe(false);
        expect(docsBadge(withCheck({ state: 'profile', sourceUrl: 'https://platformazakupowa.pl/pn/gmina' }), NOW)!.title).toContain('profilu zamawiającego');
    });

    it('platforma bez adresu: ogólna nazwa', () => {
        expect(docsBadge(withCheck({ state: 'unsupported' }), NOW)!.text).toBe('📄 dokumenty na innej platformie');
    });

    it('błąd sprawdzenia nie udaje braku dokumentów i pozwala sprawdzić ponownie', () => {
        const badge = docsBadge(withCheck({ state: 'error', nextCheckAt: at(12, 0) }), NOW)!;
        expect(badge.text).toBe('📄 nie udało się sprawdzić · ponowię 12:00');
        expect(badge.text).not.toContain('brak dokumentów');
        expect(badge.canCheckNow).toBe(true);
    });
});

describe('docsLinkUrl', () => {
    it('adres od zamawiającego (TED) wygrywa z adresem ustalonym przy sprawdzaniu', () => {
        expect(docsLinkUrl(tender({ documentsUrl: 'https://zam.pl/dok', docsCheck: { state: 'available', sourceUrl: 'https://ezamowienia.gov.pl/x' } }))).toBe('https://zam.pl/dok');
    });

    it('eZamówienia: adres strony postępowania ze sprawdzania, także gdy dokumentów jeszcze brak lub leżą na innej platformie', () => {
        expect(docsLinkUrl(withCheck({ state: 'available', sourceUrl: 'https://ezamowienia.gov.pl/mp-client/search/list/1' }))).toBe('https://ezamowienia.gov.pl/mp-client/search/list/1');
        expect(docsLinkUrl(withCheck({ state: 'none', sourceUrl: 'https://ezamowienia.gov.pl/mp-client/search/list/1' }))).toBe('https://ezamowienia.gov.pl/mp-client/search/list/1');
        expect(docsLinkUrl(withCheck({ state: 'unsupported', sourceUrl: 'https://www.dzp.agh.edu.pl' }))).toBe('https://www.dzp.agh.edu.pl');
    });

    it('Baza Konkurencyjności: strona ogłoszenia, bo tam leży dokumentacja', () => {
        expect(docsLinkUrl(tender({ source: TenderSource.BAZA_KONKURENCYJNOSCI, link: 'https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia/1' })))
            .toBe('https://bazakonkurencyjnosci.funduszeeuropejskie.gov.pl/ogloszenia/1');
    });

    it('adres z panelu eZamówień (wymaga logowania) zamienia na publiczny, także gdy pochodzi od zamawiającego', () => {
        const id = 'ocds-148610-a712e62d-12b1-46ea-948f-04271b6061b1';
        const publicUrl = `https://ezamowienia.gov.pl/mp-client/search/list/${id}`;
        expect(docsLinkUrl(tender({ documentsUrl: `https://ezamowienia.gov.pl/mp-client/tenders/${id}` }))).toBe(publicUrl);
        expect(docsLinkUrl(withCheck({ state: 'none', sourceUrl: `https://ezamowienia.gov.pl/mp-client/tenders/${id}` }))).toBe(publicUrl);
    });

    it('toPublicEzamowieniaUrl: dopisek ścieżki i zapytanie są odrzucane, inne adresy bez zmian', () => {
        const id = 'ocds-148610-a712e62d-12b1-46ea-948f-04271b6061b1';
        expect(toPublicEzamowieniaUrl(`https://ezamowienia.gov.pl/mp-client/tenders/${id}/documents?x=1`))
            .toBe(`https://ezamowienia.gov.pl/mp-client/search/list/${id}`);
        const unchanged = [
            `https://ezamowienia.gov.pl/mp-client/search/list/${id}`,
            'https://ezamowienia.gov.pl/mp-client/tenders',
            `https://inna.pl/mp-client/tenders/${id}`,
            'https://ezamowienia.gov.pl',
            'nie-adres'
        ];
        unchanged.forEach((url) => expect(toPublicEzamowieniaUrl(url)).toBe(url));
    });

    it('brak adresu to brak odnośnika (bez zgadywania)', () => {
        expect(docsLinkUrl(tender())).toBeUndefined();
        expect(docsLinkUrl(withCheck({ state: 'error' }))).toBeUndefined();
    });

    it('kopia przetargu z gwiazdką zapamiętuje gotowy odnośnik bez wyniku sprawdzania', () => {
        const stored = favoriteToDoc(withCheck({ state: 'available', sourceUrl: 'https://ezamowienia.gov.pl/x' }));
        expect(stored.documentsUrl).toBe('https://ezamowienia.gov.pl/x');
        expect('docsCheck' in stored).toBe(false);
        expect('isIT' in stored).toBe(false);
        expect(docsLinkUrl(favoriteFromDoc(stored, 'a'))).toBe('https://ezamowienia.gov.pl/x');
    });
});

describe('docsFilterOf', () => {
    it('mapuje stany na opcje filtra; błąd i brak wyniku nie pasują do żadnej', () => {
        const filterOf = (state?: DocsCheck['state']) => docsFilterOf(tender(state ? { docsCheck: { state } } : {}));
        expect([filterOf('available'), filterOf('none'), filterOf('unsupported'), filterOf('profile'), filterOf('error'), filterOf()])
            .toEqual(['available', 'none', 'otherPlatform', 'otherPlatform', undefined, undefined]);
    });
});

describe('pomocnicze', () => {
    it('platformName: znane platformy, host nieobsługiwanych, wartość zastępcza', () => {
        expect(platformName({ platform: 'ezamowienia' })).toBe('eZamówienia');
        expect(platformName({ sourceUrl: 'https://www.logintrade.net/x' })).toBe('logintrade.net');
        expect(platformName({ sourceUrl: 'nie-adres' })).toBe('innej platformie');
    });

    it('formatCheckTime: godzina dla dziś, data z godziną dla innego dnia', () => {
        expect(formatCheckTime(at(9, 5), NOW)).toBe('09:05');
        expect(formatCheckTime(at(9, 5, 1), NOW)).toBe('10.11 09:05');
    });

    it('pluralizeFiles', () => {
        expect([1, 2, 4, 5, 12, 14, 22, 25].map(pluralizeFiles)).toEqual(['plik', 'pliki', 'pliki', 'plików', 'plików', 'plików', 'pliki', 'plików']);
    });
});

describe('docsCheck w dokumencie przetargu', () => {
    const doc = { source: 'E_ZAMOWIENIA', publicationNumber: '1', title: 't', buyerName: 'b', buyerCity: 'c', publicationDate: '2026-11-09', cpvCodes: [], link: 'l' };
    const stamp = (date: Date) => ({ toDate: () => date });

    it('mapuje flagę IT i wynik sprawdzenia z datami', () => {
        const mapped = tenderFromDoc({
            ...doc, isIT: true,
            docsCheck: { state: 'none', platform: 'ezamowienia', checks: 2, checkedAt: stamp(at(10, 0)), nextCheckAt: stamp(at(12, 0)) }
        }, 'x');
        expect(mapped.isIT).toBe(true);
        expect(mapped.docsCheck).toMatchObject({ state: 'none', platform: 'ezamowienia', checks: 2, checkedAt: at(10, 0), nextCheckAt: at(12, 0) });
    });

    it('nieznany stan i brak pola nie dają docsCheck, a nie-IT nie ma flagi', () => {
        expect(tenderFromDoc({ ...doc, docsCheck: { state: 'cos-nowego' } }, 'x').docsCheck).toBeUndefined();
        const plain = tenderFromDoc(doc, 'x');
        expect('docsCheck' in plain).toBe(false);
        expect('isIT' in plain).toBe(false);
    });

    it('nextCheckAt równe null (sprawdzanie zakończone) daje brak daty', () => {
        expect(tenderFromDoc({ ...doc, docsCheck: { state: 'none', nextCheckAt: null } }, 'x').docsCheck?.nextCheckAt).toBeUndefined();
    });
});
