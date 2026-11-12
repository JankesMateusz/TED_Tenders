import { refreshTendersForDay } from "./tendersApi";

export const REFRESH_IN_PROGRESS_CODE = "functions/resource-exhausted";
// Serwer odświeża jeden dzień naraz (blokada). Gdy zajmuje go ktoś inny, czekamy i ponawiamy.
const IN_PROGRESS_RETRY_DELAY_MS = 3000;
const IN_PROGRESS_MAX_ATTEMPTS = 6;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Odświeża dzień; jeśli serwer jest zajęty odświeżaniem innej osoby, czeka i ponawia. */
export const refreshDayWithRetry = async (day: string, sources?: string[]) => {
    for (let attempt = 1; ; attempt++) {
        try {
            return await refreshTendersForDay(day, sources);
        } catch (error) {
            const code = (error as { code?: string })?.code;
            if (code !== REFRESH_IN_PROGRESS_CODE || attempt >= IN_PROGRESS_MAX_ATTEMPTS) {
                throw error;
            }
            await sleep(IN_PROGRESS_RETRY_DELAY_MS);
        }
    }
};
