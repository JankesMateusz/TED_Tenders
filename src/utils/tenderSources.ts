import { TenderSource } from "../types/TenderSource";

export interface TenderSourceConfig {
    label: string;
    color: string;
    backgroundColor: string;
}

export const tenderSourceConfig: Record<TenderSource, TenderSourceConfig> = {
    [TenderSource.TED]: {
        label: "TED",
        color: "#ffffff",
        backgroundColor: "#003366"
    },
    [TenderSource.E_ZAMOWIENIA]: {
        label: "eZamówienia",
        color: "#ffffff",
        backgroundColor: "#0066cc"
    },
    [TenderSource.BAZA_KONKURENCYJNOSCI]: {
        label: "Baza Konkurencyjności",
        color: "#ffffff",
        backgroundColor: "#cc6600"
    }
};

export const getSourceConfig = (source: TenderSource): TenderSourceConfig => {
    return tenderSourceConfig[source] || tenderSourceConfig[TenderSource.TED];
};

export interface OrderTypeConfig {
    label: string;
    color: string;
    backgroundColor: string;
}

export type OrderType = "Delivery" | "Services" | "Works";

export const orderTypeConfig: Record<OrderType, OrderTypeConfig> = {
    Delivery: {
        label: "Dostawa",
        color: "#ffffff",
        backgroundColor: "#28a745"
    },
    Services: {
        label: "Usługa",
        color: "#ffffff",
        backgroundColor: "#17a2b8"
    },
    Works: {
        label: "Roboty budowlane",
        color: "#ffffff",
        backgroundColor: "#ffc107"
    }
};

export const getOrderTypeConfig = (orderType: OrderType): OrderTypeConfig => {
    return orderTypeConfig[orderType];
};

