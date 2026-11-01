import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';

/** Region funkcji wywoływanych z klienta; frontend (src/firebase.ts) musi używać tego samego. */
export const REGION = 'europe-central2';

export type Role = 'admin' | 'member';

/**
 * TYMCZASOWO (otwarty dostęp): wymaga tylko zalogowania, także anonimowego; zwraca uid.
 * Docelowo wraca wymóg roli admina lub członka (git revert commita „Temporarily open access”).
 */
export const requireMember = (request: CallableRequest): string => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Wymagane zalogowanie.');
  }
  return request.auth.uid;
};

/** Wymaga zalogowanego administratora; zwraca jego uid. */
export const requireAdmin = (request: CallableRequest): string => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Wymagane zalogowanie.');
  }
  if (request.auth.token.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Ta operacja wymaga uprawnień administratora.');
  }
  return request.auth.uid;
};
