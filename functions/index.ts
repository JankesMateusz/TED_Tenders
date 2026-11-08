import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { inviteUser, listUsersStatus } from './users';
export { refreshTenders, scheduledBazaRefresh, scheduledRefresh } from './tenders/refresh';
export { snapshotLabelOnStatusChange } from './labels/labelSnapshot';
export { resolveDocumentsCallable as resolveDocuments } from './analysis/resolveCallable';
export { checkDocsNow, checkDocumentsTask, enqueueDocsCheckOnCreate, enqueueDocsChecks } from './analysis/docsCheck/docsCheck';

// Funkcje modułu zamówień. Wymagają sekretu ORDERS_DATABASE_URL w projekcie, na który wdrażamy (patrz db/README.md).
export {
  getBuyerCallable as getBuyer,
  getDictionariesCallable as getDictionaries,
  getOrderCallable as getOrder,
  listOrdersCallable as listOrders,
  searchBuyersCallable as searchBuyers,
} from './orders/callables';
