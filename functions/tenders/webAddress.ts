/**
 * Normalizuje adres strony wpisany przez zamawiającego. Zamawiający często podają sam host
 * („www.dzp.agh.edu.pl") bez `https://`, zarówno w polu 3.1 ogłoszenia BZP, jak i w `document-url-lot` z TED.
 * Zwraca adres http(s) (host bez schematu dostaje `https://`) albo null dla czegokolwiek, co nie jest adresem WWW.
 * Inne schematy (np. `javascript:`) są odrzucane, bo adres trafia do odnośnika w interfejsie.
 */
export const normalizeWebAddress = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const token = value.trim().replace(/[.,;]+$/, '');
  if (/^https?:\/\/\S+$/i.test(token)) return token;
  // Sam host z co najmniej jedną kropką i literową końcówką, opcjonalnie port i ścieżka; „3.2.)" czy „Nie dotyczy" nie przejdą
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}(:\d+)?([/?#]\S*)?$/i.test(token)) return `https://${token}`;
  return null;
};
