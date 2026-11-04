import { TenderSource } from '../types/TenderSource';
import { getSourceAttribution } from './tenderSources';

describe('getSourceAttribution', () => {
    const fetchedAt = new Date(2026, 10, 4, 9, 30);

    it('podaje źródło, pełną nazwę ministerstwa, datę pobrania i informację o przetworzeniu dla Bazy Konkurencyjności', () => {
        const text = getSourceAttribution(TenderSource.BAZA_KONKURENCYJNOSCI, fetchedAt);
        expect(text).toContain('Baza Konkurencyjności');
        expect(text).toContain('Ministerstwo Funduszy i Polityki Regionalnej');
        expect(text).toContain('04-11-2026');
        expect(text).toContain('przetworzono');
    });

    it('nie dodaje atrybucji dla pozostałych źródeł ani bez daty pobrania', () => {
        expect(getSourceAttribution(TenderSource.TED, fetchedAt)).toBeNull();
        expect(getSourceAttribution(TenderSource.E_ZAMOWIENIA, fetchedAt)).toBeNull();
        expect(getSourceAttribution(TenderSource.BAZA_KONKURENCYJNOSCI, undefined)).toBeNull();
    });
});
