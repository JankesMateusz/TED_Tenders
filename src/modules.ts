/**
 * Moduły aplikacji dostępne z menu w nagłówku. Nowy moduł: dopisz wpis w APP_MODULES i dodaj jego ekran w App.tsx.
 * Moduły przełączamy adresem (hash), więc działa przycisk "wstecz" i można wysłać link do konkretnego widoku.
 */
export type ModuleId = 'tenders' | 'orders';

export interface AppModule {
    id: ModuleId;
    label: string;
    /** Początek hasha adresu. Pusty dla modułu domyślnego (bez hasha). */
    hash: string;
    enabled: boolean;
}

/** Moduł zamówień jest ukryty, dopóki nie włączymy go flagą (POC: dane z bazy działają na razie tylko lokalnie). */
export const ORDERS_ENABLED = process.env.REACT_APP_ENABLE_ORDERS === 'true';

export const DEFAULT_MODULE_ID: ModuleId = 'tenders';

export const APP_MODULES: AppModule[] = [
    { id: 'tenders', label: 'Przetargi', hash: '', enabled: true },
    { id: 'orders', label: 'Zamówienia', hash: '#/zamowienia', enabled: ORDERS_ENABLED },
];

export const enabledModules = (modules: AppModule[] = APP_MODULES): AppModule[] => modules.filter((m) => m.enabled);

/**
 * Moduł wskazany hashem adresu. Hash musi pasować w całości albo być jego podścieżką (`#/zamowienia/123`).
 * Adres nieznany albo wyłączonego modułu prowadzi do modułu domyślnego.
 */
export const moduleForHash = (hash: string, modules: AppModule[] = APP_MODULES): ModuleId => {
    const normalized = hash.replace(/\/+$/, '');
    const match = modules.find(
        (m) => m.enabled && m.hash !== '' && (normalized === m.hash || normalized.startsWith(`${m.hash}/`))
    );
    return match ? match.id : DEFAULT_MODULE_ID;
};

/** Przechodzi do modułu przez zmianę hasha (przeglądarka sama zgłasza hashchange, więc ekran się przełączy). */
export const navigateToModule = (module: AppModule): void => {
    window.location.hash = module.hash;
};
