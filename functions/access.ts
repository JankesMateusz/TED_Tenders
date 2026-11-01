import { CallableRequest, HttpsError } from 'firebase-functions/v2/https';

/** Region funkcji wywoływanych z klienta; frontend (src/firebase.ts) musi używać tego samego. */
export const REGION = 'europe-central2';

export type Role = 'admin' | 'member';

/** Wymaga zalogowanego użytkownika z rolą admina lub członka; zwraca jego uid. */
export const requireMember = (request: CallableRequest): string => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Wymagane zalogowanie.');
  }
  const role = request.auth.token.role;
  if (role !== 'admin' && role !== 'member') {
    throw new HttpsError('permission-denied', 'Brak uprawnień do tej operacji.');
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
