import axios from "axios";
import { Notice } from "../models/Notice";
import { TenderSource } from "../types/TenderSource";

const API_URL = "https://us-central1-tendersted.cloudfunctions.net/api/tedProxy";

/**
 * Konwertuje zakres dat na format TED API (YYYYMMDD)
 */
const formatDateForTED = (date: string): string => {
    return date.replace(/-/g, "");
};

/**
 * Generuje query dla TED API dla zakresu dat
 */
const buildTEDQuery = (startDate: string, endDate: string): string => {
    const startFormatted = formatDateForTED(startDate);
    const endFormatted = formatDateForTED(endDate);
    
    if (startDate === endDate) {
        // Dla jednego dnia używamy prostszego query
        return `buyer-country=POL AND publication-date=${startFormatted} AND classification-cpv=teeq AND notice-type=cn-standard`;
    } else {
        // Dla zakresu dat używamy zakresu
        return `buyer-country=POL AND publication-date>=${startFormatted} AND publication-date<=${endFormatted} AND classification-cpv=teeq AND notice-type=cn-standard`;
    }
};

export const fetchTenders = async (startDate: string, endDate: string): Promise<Notice[]> => {
    try {
        const query = buildTEDQuery(startDate, endDate);
        let allNotices: Notice[] = [];
        let currentPage = 1;
        let hasMoreData = true;

        while (hasMoreData) {
            const response = await axios.post(API_URL, {
                query: query,
                fields: [
                    "notice-title",
                    "classification-cpv",
                    "publication-date",
                    "publication-number",
                    "buyer-city",
                    "organisation-name-buyer",
                    "change-notice-version-identifier",
                    "deadline-receipt-tender-date-lot",
                ],
                page: currentPage,
                limit: 250
            }, {
                headers: { 
                    "Content-Type": "application/json"
                }
            });

            const notices = response.data.notices.map((notice: any) => new Notice(notice, TenderSource.TED));
            allNotices = [...allNotices, ...notices];

            // Jeśli otrzymaliśmy mniej niż 250 wyników, oznacza to że to ostatnia strona
            if (notices.length < 250) {
                hasMoreData = false;
            } else {
                currentPage++;
            }
        }

        console.log(`Pobrano łącznie ${allNotices.length} przetargów`);
        return allNotices;
    } catch (error) {
        console.error("Błąd pobierania przetargów:", error);
        return [];
    }
};