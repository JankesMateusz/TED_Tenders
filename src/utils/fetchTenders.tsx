import axios from "axios";
import { Notice } from "../models/Notice";

const API_URL = "https://api.ted.europa.eu/v3/notices/search";
const API_KEY = "TWOJ_KLUCZ_API"; // Wstaw swój klucz API

export const fetchTenders = async (date: string): Promise<Notice[]> => {
    try {
        const formattedDate = date.replace(/-/g, ""); // Zamiana yyyy-mm-dd na yyyyMMdd

        const response = await axios.post(API_URL, {
            query: `buyer-country=POL AND publication-date=${formattedDate} AND classification-cpv=teeq AND notice-type=cn-standard AND notice-type!=corr`,
            fields: [
                "notice-title",
                "classification-cpv",
                "publication-date",
                "publication-number",
                "buyer-city",
                "organisation-name-buyer",
                "change-notice-version-identifier",
                "deadline-receipt-tender-date-lot"
            ],
            page: 1,
            limit: 250
        }, {
            headers: { 
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        console.log(response.config)
        return response.data.notices.map((notice: any) => new Notice(notice));
    } catch (error) {
        console.error("Błąd pobierania przetargów:", error);
        return [];
    }
};