import axios, { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';

/** Statusy oznaczające chwilowe ograniczenie lub awarię po stronie źródła; zapytanie warto ponowić. */
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
// Bazowe opóźnienie można skrócić w testach (functions/.env.demo-tenders)
const BASE_DELAY_MS = Number(process.env.HTTP_RETRY_BASE_MS ?? 1000);
/** Kolejne opóźnienia przed ponowieniem to wielokrotności bazowego; tyle też jest maksymalnie ponowień. */
const DELAY_FACTORS = [1, 3, 8];
const MAX_RETRY_AFTER_MS = 15000;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const retryDelayMs = (error: unknown, attempt: number): number => {
  const retryAfterSeconds = isAxiosError(error) ? Number(error.response?.headers?.['retry-after']) : NaN;
  return retryAfterSeconds > 0
    ? Math.min(retryAfterSeconds * 1000, MAX_RETRY_AFTER_MS)
    : BASE_DELAY_MS * DELAY_FACTORS[attempt];
};

/**
 * Wykonuje zapytanie HTTP i ponawia je z narastającym opóźnieniem, gdy źródło ogranicza tempo (429)
 * lub chwilowo nie odpowiada (502/503/504). Inne błędy przekazuje od razu.
 */
export const requestWithRetry = async <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await axios.request<T>(config);
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (status === undefined || !RETRYABLE_STATUSES.has(status) || attempt >= DELAY_FACTORS.length) {
        throw error;
      }
      const delay = retryDelayMs(error, attempt);
      console.warn(`Źródło odpowiedziało ${status}, ponawiam za ${delay} ms (próba ${attempt + 1}/${DELAY_FACTORS.length})`);
      await sleep(delay);
    }
  }
};
