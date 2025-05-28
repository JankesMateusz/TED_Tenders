export class Notice {
    publicationNumber: string;
    publicationDate: string;
    deadlineDate: string;
    cpvCodes: string[];
    country: string;
    title: string;
    link: string;
    buyerName: string;
    buyerCity: string;
    changeNoticeVersionIdentifier: string | null;

    constructor(data: any) {
        this.publicationNumber = data["publication-number"];
        this.publicationDate = this.formatDate(data["publication-date"]);
        this.deadlineDate = this.formatDate(data["deadline-receipt-tender-date-lot"]) || "Brak terminu";
        this.cpvCodes = data["classification-cpv"] || [];
        this.country = this.extractCountry(data["notice-title"]);
        this.title = data["notice-title"]?.pol || "Brak tytułu";
        this.link = this.constructLink(data);
        this.buyerName = data["organisation-name-buyer"]?.pol?.[0] || "Brak danych";
        this.buyerCity = data["buyer-city"]?.mul?.[0] || "Brak miasta";
        this.changeNoticeVersionIdentifier = data["change-notice-version-identifier"] || null;
    }

    private extractCountry(titleObj: any): string {
        if (!titleObj) return "Nieznany kraj";
        return titleObj["pol"]?.split("–")[0].trim() || "Nieznany kraj";
    }

    private formatDate(rawDate: any): string {
        if (!rawDate) return "Brak daty";
        
        try {
            if (Array.isArray(rawDate)) {
                rawDate = rawDate[0]; // Take the first date if it's an array
            }
            
            const datePart = rawDate.split("+")[0]; // Usuwamy część z +02:00
            const [year, month, day] = datePart.split("-");
            return `${day}-${month}-${year}`;
        } catch (error) {
            console.log('Error formatting date:', rawDate);
            return "Błąd formatu daty";
        }
    }

    private constructLink(data: any): string {
        if (data["publication-number"]) {
            // Use the standard TED notice URL format
            return `https://ted.europa.eu/udl?uri=TED:NOTICE:${data["publication-number"]}:TEXT:PL:HTML`;
        }
        return "#";
    }
}