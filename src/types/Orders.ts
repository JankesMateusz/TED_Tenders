// KOPIA functions/orders/types.ts (aplikacja nie może importować z functions/). Przy zmianie zsynchronizuj oba pliki.
// Kształty odpowiedzi funkcji modułu zamówień (JSON zwracany do przeglądarki). Daty to tekst "RRRR-MM-DD".

export interface BuyerSummary {
  id: number;
  name: string;
  town: string | null;
  province: string | null;
}

export interface OrderListItem {
  id: number;
  year: number;
  mdpId: string;
  endUserBidNumber: string | null;
  name: string | null;
  registeredOn: string;
  publicationDate: string | null;
  bidDate: string | null;
  status: string;
  accountType: string | null;
  budget: string | null;
  buyer: BuyerSummary;
  positionsCount: number;
  lobCategories: string[];
  /** Liczba pozycji w każdym statusie pozycji (Pending, Confirmed, Refuse, Cancel). */
  positionStatusCounts: Record<string, number>;
  positionsWithWinner: number;
}

export interface OrderListPage {
  items: OrderListItem[];
  /** Kursor do następnej strony albo null, gdy to koniec listy. */
  nextCursor: string | null;
}

export interface BuyerDetails {
  id: number;
  name: string;
  street: string | null;
  zipCode: string | null;
  town: string | null;
  province: string | null;
  nip: string | null;
  /** Rekord główny, jeśli ten rekord uznano za tego samego zamawiającego (grupowanie duplikatów). */
  canonicalId: number | null;
}

export interface ContactDetails {
  id: number;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  email2: string | null;
  fax: string | null;
}

export interface PositionDetails {
  id: number;
  positionNumber: number;
  legacyId: string | null;
  partLabel: string | null;
  lobCategory: string | null;
  quantity: number | null;
  architecture: string | null;
  cpuNo: string | null;
  os: string | null;
  office: string | null;
  initialBenchmark: string | null;
  acquisitionForm: string | null;
  remarks: string | null;
  attributes: Record<string, unknown>;
  status: string;
  statusLabel: string;
  winner: { id: number; name: string } | null;
  vendor: { id: number; name: string } | null;
  awardLetterDate: string | null;
  finalOffice: string | null;
  deliveryTerm: string | null;
  partValue: string | null;
  version: number;
}

export interface LetterDetails {
  id: number;
  sentAt: string;
  orderStatus: string | null;
  mailTo: string[];
  mailCc: string[];
  confirmedOn: string | null;
  cancelledAt: string | null;
}

export interface OrderDetails {
  id: number;
  year: number;
  mdpId: string;
  endUserBidNumber: string | null;
  name: string | null;
  registeredOn: string;
  orderWeek: string;
  publicationDate: string | null;
  publicationQuarter: string | null;
  bidDate: string | null;
  siwzUrl: string | null;
  extraUrls: string[];
  financingEu: boolean;
  budget: string | null;
  accountType: string | null;
  outsideUzp: boolean;
  lenovoTopTen: boolean;
  comments: string | null;
  status: string;
  statusLabel: string;
  /** Kwota, z jaką wygrano przetarg (całość). Zwykle pusta; patrz README bazy. */
  valueTotal: string | null;
  partsCount: number | null;
  avgPartValue: string | null;
  sourceTenderId: string | null;
  version: number;
  buyer: BuyerDetails;
  contact: ContactDetails | null;
  positions: PositionDetails[];
  letters: LetterDetails[];
}

export interface DictionaryOption {
  code: string;
  /** Opis lub etykieta do wyświetlenia; null, gdy słownik nie ma opisu. */
  label: string | null;
}

export interface Dictionaries {
  lobCategories: DictionaryOption[];
  accountTypes: DictionaryOption[];
  orderStatuses: DictionaryOption[];
  positionStatuses: DictionaryOption[];
  /** Lata, w których są zamówienia, od najnowszego. */
  years: number[];
}

export interface BuyerSearchItem extends BuyerDetails {
  ordersCount: number;
  contactsCount: number;
}

export interface BuyerWithContacts extends BuyerDetails {
  contacts: ContactDetails[];
  ordersCount: number;
  recentOrders: { id: number; year: number; mdpId: string; registeredOn: string; name: string | null }[];
}
