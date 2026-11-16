import { existsSync } from 'fs';
import { join } from 'path';
import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { inviteUser, listUsersStatus } from './users';
export { refreshTenders, scheduledBazaRefresh, scheduledRefresh } from './tenders/refresh';
export { snapshotLabelOnStatusChange } from './labels/labelSnapshot';
export { resolveDocumentsCallable as resolveDocuments } from './analysis/resolveCallable';
export { checkDocsNow, checkDocumentsTask, enqueueDocsCheckOnCreate, enqueueDocsChecks } from './analysis/docsCheck/docsCheck';

// Funkcje modułu zamówień. Eksportowane tylko, gdy istnieje plik functions/orders.enabled (tworzy go deploy.yml dla
// środowiska testowego), bo wymagają sekretu ORDERS_DATABASE_URL w projekcie, na który wdrażamy (patrz db/README.md).
// Bez pliku funkcje nie istnieją w tym wdrożeniu, więc projekt bez sekretu (produkcja) wdraża się normalnie.
// Zmienna środowiskowa się nie nadaje: Firebase CLI nie przekazuje jej do wykrywania funkcji podczas wdrożenia.
if (existsSync(join(__dirname, '..', 'orders.enabled'))) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const orders = require('./orders/callables');
  exports.getBuyer = orders.getBuyerCallable;
  exports.getDictionaries = orders.getDictionariesCallable;
  exports.getOrder = orders.getOrderCallable;
  exports.listOrders = orders.listOrdersCallable;
  exports.searchBuyers = orders.searchBuyersCallable;
}

// Zdarzenia do podsumowania „od ostatniej wizyty” (kolekcja `events`).
export { recordTenderEvents } from './notifications/events';
