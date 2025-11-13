import axios from "axios";
import { Notice } from "../models/Notice";
import { TenderSource } from "../types/TenderSource";

const API_URL = "https://ezamowienia.gov.pl/mo-board/api/v1/Board/Search";

interface EzamowieniaResponse {
    noticeNumber: string;
    publicationDate: string;
    submittingOffersDate: string | null;
    cpvCode: string;
    orderObject: string;
    organizationName: string;
    organizationCity: string;
    moIdentifier: string;
    orderType: "Delivery" | "Services" | "Works";
    [key: string]: any;
}

/**
 * Parsuje datę ISO do formatu DD-MM-YYYY
 */
const formatDateFromISO = (isoDate: string | null): string => {
    if (!isoDate) return "Brak daty";
    
    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return "Brak daty";
        
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        
        return `${day}-${month}-${year}`;
    } catch (error) {
        console.warn('Error formatting date from ISO:', isoDate, error);
        return "Błąd formatu daty";
    }
};

/**
 * Wyciąga kody CPV z stringa w formacie "kod (nazwa)" lub "kod, kod"
 */
const extractCpvCodes = (cpvString: string): string[] => {
    if (!cpvString) return [];
    
    try {
        // Format może być: "34144710-8 (Ładowarki jezdne)" lub "30213300-8 (Komputer),48000000-8 (...)"
        // Wyciągamy wszystko przed nawiasem lub przed przecinkiem
        const codes: string[] = [];
        const parts = cpvString.split(',');
        
        for (const part of parts) {
            const trimmed = part.trim();
            // Szukamy kodu CPV (format: XXXXXXXX-X lub XXXXXXXX)
            // Format kodu CPV: 8 cyfr, opcjonalny myślnik i cyfry
            const match = trimmed.match(/^(\d{8}(?:-\d+)?)/);
            if (match) {
                codes.push(match[1]);
            }
        }
        
        return codes.length > 0 ? codes : [];
    } catch (error) {
        console.warn('Error extracting CPV codes:', cpvString, error);
        return [];
    }
};

/**
 * Konwertuje datę YYYY-MM-DD na zakres ISO (od początku do końca dnia)
 */
const getDateRangeISO = (date: string): { from: string; to: string } => {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    const from = dateObj.toISOString();
    
    dateObj.setHours(23, 59, 59, 999);
    const to = dateObj.toISOString();
    
    return { from, to };
};

/**
 * Mapuje dane z eZamówienia do struktury Notice
 */
const mapEzamowieniaToNotice = (data: EzamowieniaResponse, orderType: "Delivery" | "Services" | "Works"): Notice => {
    // Tworzymy obiekt w formacie zgodnym z konstruktorem Notice
    // ale dla eZamówienia musimy użyć alternatywnego podejścia
    const noticeData: any = {
        "publication-number": data.noticeNumber,
        "publication-date": data.publicationDate,
        "deadline-receipt-tender-date-lot": data.submittingOffersDate,
        "classification-cpv": extractCpvCodes(data.cpvCode),
        "notice-title": {
            pol: data.orderObject
        },
        "organisation-name-buyer": {
            pol: [data.organizationName]
        },
        "buyer-city": {
            mul: [data.organizationCity]
        },
        "change-notice-version-identifier": null
    };
    
    // Tworzymy instancję Notice
    const notice = new Notice(noticeData, TenderSource.E_ZAMOWIENIA);
    
    // Nadpisujemy link i inne pola specyficzne dla eZamówienia
    notice.link = `https://ezamowienia.gov.pl/mo-client-board/bzp/notice-details/id/${data.objectId}`;
    notice.country = "Polska";
    notice.orderType = orderType;
    
    // Formatujemy daty ręcznie (bo konstruktor oczekuje innego formatu)
    notice.publicationDate = formatDateFromISO(data.publicationDate);
    notice.deadlineDate = formatDateFromISO(data.submittingOffersDate) || "Brak terminu";
    
    return notice;
};

/**
 * Pobiera przetargi z eZamówienia dla danego typu zamówienia (Delivery, Services, Works)
 */
const fetchEzamowieniaByOrderType = async (
    date: string,
    orderType: "Delivery" | "Services" | "Works"
): Promise<Notice[]> => {
    try {
        const { from: publicationDateFrom, to: publicationDateTo } = getDateRangeISO(date);
        let allNotices: Notice[] = [];
        let currentPage = 1;
        const pageSize = 10;
        let hasMoreData = true;

        while (hasMoreData) {
            const params = new URLSearchParams({
                noticeType: "ContractNotice",
                isTenderAmountBelowEU: "true",
                publicationDateFrom: publicationDateFrom,
                publicationDateTo: publicationDateTo,
                orderType: orderType,
                SortingColumnName: "PublicationDate",
                SortingDirection: "DESC",
                PageNumber: currentPage.toString(),
                PageSize: pageSize.toString()
            });

            const response = await axios.get(`${API_URL}?${params.toString()}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const notices = response.data.map((notice: EzamowieniaResponse) => 
                mapEzamowieniaToNotice(notice, orderType)
            );
            
            allNotices = [...allNotices, ...notices];

            // Jeśli otrzymaliśmy mniej niż pageSize wyników, oznacza to że to ostatnia strona
            if (notices.length < pageSize) {
                hasMoreData = false;
            } else {
                currentPage++;
            }
        }

        console.log(`Pobrano ${allNotices.length} przetargów z eZamówienia (${orderType})`);
        return allNotices;
    } catch (error) {
        console.error(`Błąd pobierania przetargów z eZamówienia (${orderType}):`, error);
        return [];
    }
};

/**
 * Pobiera przetargi z eZamówienia dla danego dnia (wszystkie typy: Delivery, Services, Works)
 */
export const fetchEzamowienia = async (date: string): Promise<Notice[]> => {
    try {
        // Pobieranie równolegle wszystkich trzech typów zamówień
        const results = await Promise.allSettled([
            fetchEzamowieniaByOrderType(date, "Delivery"),
            fetchEzamowieniaByOrderType(date, "Services"),
            fetchEzamowieniaByOrderType(date, "Works")
        ]);

        let allNotices: Notice[] = [];

        // Przetwarzanie wyników z każdego typu
        results.forEach((result, index) => {
            const orderTypes = ["Delivery", "Services", "Works"] as const;
            if (result.status === 'fulfilled') {
                allNotices = [...allNotices, ...result.value];
            } else {
                console.error(`Błąd pobierania przetargów z eZamówienia (${orderTypes[index]}):`, result.reason);
            }
        });

        console.log(`Pobrano łącznie ${allNotices.length} przetargów z eZamówienia (wszystkie typy)`);
        return allNotices;
    } catch (error) {
        console.error("Błąd pobierania przetargów z eZamówienia:", error);
        return [];
    }
};

