import { isAxiosError } from 'axios';
import { requestWithRetry } from '../../tenders/http';
import { HttpClient, HttpRequestOptions, HttpResponse, ResolverError } from './types';

const REQUEST_TIMEOUT_MS = 30000;
/** Uczciwy User-Agent: platformy widzą, kto pyta (plan 3.7, D15). */
export const RESOLVER_USER_AGENT = 'TED-Tenders-DocCheck/1.0 (narzedzie wewnetrzne, pojedyncze zapytania o liste plikow)';

/** Klient produkcyjny: ponowienia 429/5xx z `requestWithRetry`, timeout, uczciwy User-Agent. */
export const createHttpClient = (): HttpClient => ({
  async get<T>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    try {
      const followRedirects = options.followRedirects !== false;
      const response = await requestWithRetry<T>({
        method: 'get',
        url,
        timeout: REQUEST_TIMEOUT_MS,
        headers: { 'User-Agent': RESOLVER_USER_AGENT, Accept: options.text ? 'text/html' : 'application/json' },
        responseType: options.text ? 'text' : 'json',
        maxRedirects: followRedirects ? 5 : 0,
        validateStatus: (status) => status < 400,
      });
      const location = response.headers?.location;
      return { status: response.status, data: response.data, location: typeof location === 'string' ? location : undefined };
    } catch (error) {
      if (isAxiosError(error)) {
        throw new ResolverError(`Zapytanie do platformy nie powiodło się: ${error.response?.status ?? error.code ?? error.message}`, {
          url,
          status: error.response?.status,
        });
      }
      throw error;
    }
  },
});
