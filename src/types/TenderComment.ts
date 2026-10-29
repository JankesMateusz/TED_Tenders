export interface TenderComment {
    id: string;
    /** Identyfikator przetargu, którego dotyczy komentarz (id dokumentu w `tenders`). */
    tenderId: string;
    text: string;
    authorUid: string;
    authorEmail: string;
    createdAt: Date;
}
