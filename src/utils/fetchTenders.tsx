import axios from "axios";
import { Notice } from "../models/Notice";

const API_URL = "https://us-central1-tendersted.cloudfunctions.net/api/tedProxy";

export const fetchTenders = async (date: string): Promise<Notice[]> => {
    try {
        const formattedDate = date.replace(/-/g, ""); // Zamiana yyyy-mm-dd na yyyyMMdd
        let allNotices: Notice[] = [];
        let currentPage = 1;
        let hasMoreData = true;

        while (hasMoreData) {
            const response = await axios.post(API_URL, {
                query: `buyer-country=POL AND publication-date=${formattedDate} AND classification-cpv=teeq AND notice-type=cn-standard`,
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

            const notices = response.data.notices.map((notice: any) => new Notice(notice));
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