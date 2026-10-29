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
    source: TenderSource;
    orderType?: "Delivery" | "Services" | "Works";
    changeNoticeVersionIdentifier?: string | null;
    country?: string;
    buyerMainActivity?: string;
    /** Wspólny status, jeśli ktoś go ustawił; autor i czas służą do podpowiedzi. */
    status?: TenderStatus;
    statusByEmail?: string;
    statusAt?: Date;
}

