import { isAxiosError } from 'axios';
import { requestWithRetry } from '../../tenders/http';
import { HttpClient, HttpRequestOptions, HttpResponse, ResolverError } from './types';

const REQUEST_TIMEOUT_MS = 30000;
/** Uczciwy User-Agent: platformy widzą, kto pyta (plan 3.7, D15). */
export const RESOLVER_USER_AGENT = 'TED-Tenders-DocCheck/1.0 (narzedzie wewnetrzne, pojedyncze zapytania o liste plikow)';

const MAX_SESSION_HOPS = 8;

/** Minimalny słoik ciasteczek na czas jednego zapytania: nazwa=wartość per host (wystarcza do łańcucha SSO platformy). */
const storeCookies = (jar: Map<string, Map<string, string>>, host: string, setCookie: unknown) => {
  const lines = Array.isArray(setCookie) ? setCookie : typeof setCookie === 'string' ? [setCookie] : [];
  const cookies = jar.get(host) ?? new Map<string, string>();
  for (const line of lines) {
    const [pair] = String(line).split(';');
    const eq = pair.indexOf('=');
    if (eq > 0) cookies.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
  jar.set(host, cookies);
};

const cookieHeader = (jar: Map<string, Map<string, string>>, host: string): string | undefined => {
  const cookies = jar.get(host);
  return cookies && cookies.size ? [...cookies].map(([k, v]) => `${k}=${v}`).join('; ') : undefined;
};

/** Klient produkcyjny: ponowienia 429/5xx z `requestWithRetry`, timeout, uczciwy User-Agent. */
export const createHttpClient = (): HttpClient => ({
  async get<T>(url: string, options: HttpRequestOptions = {}): Promise<HttpResponse<T>> {
    try {
      const headers = { 'User-Agent': RESOLVER_USER_AGENT, Accept: options.text ? 'text/html' : 'application/json' };
      const responseType = options.text ? 'text' : 'json';
      const single = options.followRedirects === false;

      if (!options.session) {
        const response = await requestWithRetry<T>({
          method: 'get',
          url,
          timeout: REQUEST_TIMEOUT_MS,
          headers,
          responseType,
          maxRedirects: single ? 0 : 5,
          validateStatus: (status) => status < 400,
        });
        const location = response.headers?.location;
        return { status: response.status, data: response.data, location: typeof location === 'string' ? location : undefined };
      }

      // Sesja: ręczne przechodzenie przekierowań z ciasteczkami (platformazakupowa.pl odsyła przez SSO i wraca ze stroną)
      const jar = new Map<string, Map<string, string>>();
      let current = url;
      for (let hop = 0; hop <= MAX_SESSION_HOPS; hop++) {
        const host = new URL(current).hostname;
        const cookie = cookieHeader(jar, host);
        const response = await requestWithRetry<T>({
          method: 'get',
          url: current,
          timeout: REQUEST_TIMEOUT_MS,
          headers: cookie ? { ...headers, Cookie: cookie } : headers,
          responseType,
          maxRedirects: 0,
          validateStatus: (status) => status < 400,
        });
        storeCookies(jar, host, response.headers?.['set-cookie']);
        const location = response.headers?.location;
        if (response.status < 300 || typeof location !== 'string') {
          return { status: response.status, data: response.data };
        }
        current = new URL(location, current).toString();
        if (new URL(current).protocol !== 'https:') throw new ResolverError('Przekierowanie na adres inny niż https.', { url: current });
      }
      throw new ResolverError('Zbyt wiele przekierowań (pętla logowania SSO?).', { url });
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
