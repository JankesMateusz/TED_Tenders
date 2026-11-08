import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { inviteUser, listUsersStatus } from './users';
export { refreshTenders, scheduledBazaRefresh, scheduledRefresh } from './tenders/refresh';
export { snapshotLabelOnStatusChange } from './labels/labelSnapshot';
export { resolveDocumentsCallable as resolveDocuments } from './analysis/resolveCallable';
export { checkDocsNow, checkDocumentsTask, enqueueDocsCheckOnCreate, enqueueDocsChecks } from './analysis/docsCheck/docsCheck';

// Funkcje modułu zamówień są na razie dostępne tylko w emulatorze. Wymagają sekretu ORDERS_DATABASE_URL, którego nie ma
// jeszcze w projekcie testowym, a bez niego wdrożenie wszystkich funkcji by się nie udało (patrz db/README.md).
// Po ustawieniu sekretu zamienić ten blok na zwykły eksport z './orders/callables'.
if (process.env.FUNCTIONS_EMULATOR === 'true') {
  const orders = require('./orders/callables') as typeof import('./orders/callables');
  exports.getDictionaries = orders.getDictionariesCallable;
  exports.listOrders = orders.listOrdersCallable;
  exports.getOrder = orders.getOrderCallable;
  exports.searchBuyers = orders.searchBuyersCallable;
  exports.getBuyer = orders.getBuyerCallable;
}
