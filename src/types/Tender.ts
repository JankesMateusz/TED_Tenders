import { TenderSource } from './TenderSource';
import { TenderStatus } from './TenderStatus';

export interface Tender {
    /** Identyfikator dokumentu w Firestore (`{źródło}_{numer}`); numer publikacji sam nie jest unikalny między źródłami. */
    id: string;
    publicationNumber: string;
    title: string;
    buyerName: string;
    buyerCity: string;
    publicationDate: string;
    publicationTime?: string;
    deadlineDate: string;
    cpvCodes: string[];
    link: string;
    /** Adres dokumentacji: w TED podany przez zamawiającego (jeśli go podał), w Bazie Konkurencyjności strona ogłoszenia. */
    documentsUrl?: string;
    source: TenderSource;
    orderType?: "Delivery" | "Services" | "Works";
    changeNoticeVersionIdentifier?: string | null;
    country?: string;
    buyerMainActivity?: string;
    /** Kiedy aplikacja pobrała przetarg ze źródła (do atrybucji danych z Bazy Konkurencyjności). */
    fetchedAt?: Date;
    /** Wspólny status, jeśli ktoś go ustawił; autor i czas służą do podpowiedzi. */
    status?: TenderStatus;
    statusByEmail?: string;
    statusAt?: Date;
}

