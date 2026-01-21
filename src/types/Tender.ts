import { TenderSource } from './TenderSource';

export interface Tender {
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
}

