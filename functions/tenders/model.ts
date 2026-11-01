export type TenderSource = 'TED' | 'E_ZAMOWIENIA';

export type OrderType = 'Delivery' | 'Services' | 'Works';

/** Przetarg w postaci zapisywanej w Firestore (kolekcja `tenders`). */
export interface TenderRecord {
  source: TenderSource;
  publicationNumber: string;
  title: string;
  buyerName: string;
  buyerCity: string;
  country: string;
  /** Dzień publikacji w strefie Europe/Warsaw, YYYY-MM-DD (nadaje się do filtrowania i sortowania). */
  publicationDate: string;
  /** Godzina publikacji HH:MM (tylko eZamówienia). */
  publicationTime: string | null;
  /** Termin składania ofert, YYYY-MM-DD. */
  deadlineDate: string | null;
  cpvCodes: string[];
  link: string;
  /** Adres dokumentacji zamówienia podany przez zamawiającego (często zewnętrzna platforma zakupowa); null, gdy brak. */
  documentsUrl: string | null;
  orderType: OrderType | null;
  buyerMainActivity: string | null;
}

/** Wynik pobierania z jednego źródła; częściowe błędy nie wyrzucają już pobranych przetargów. */
export interface SourceResult {
  records: TenderRecord[];
  errors: string[];
}

/** Identyfikator dokumentu: stabilny, więc ponowne pobranie nie tworzy duplikatów. */
export const tenderId = (tender: Pick<TenderRecord, 'source' | 'publicationNumber'>): string =>
  // "/" jest niedozwolone w identyfikatorze dokumentu, a numery eZamówień je zawierają (np. "2026/BZP 00510442/01")
  `${tender.source}_${tender.publicationNumber}`.replace(/[/\s]+/g, '_');
