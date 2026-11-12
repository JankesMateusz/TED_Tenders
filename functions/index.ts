import { initializeApp } from 'firebase-admin/app';

initializeApp();

export { inviteUser, listUsersStatus } from './users';
export { refreshTenders, scheduledBazaRefresh, scheduledRefresh } from './tenders/refresh';
export { snapshotLabelOnStatusChange } from './labels/labelSnapshot';
export { resolveDocumentsCallable as resolveDocuments } from './analysis/resolveCallable';
export { checkDocsNow, checkDocumentsTask, enqueueDocsCheckOnCreate, enqueueDocsChecks } from './analysis/docsCheck/docsCheck';

// Zdarzenia do podsumowania „od ostatniej wizyty” (kolekcja `events`).
export { recordTenderEvents } from './notifications/events';
