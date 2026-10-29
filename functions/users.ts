import { UserRecord, getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { CallableRequest, HttpsError, onCall } from 'firebase-functions/v2/https';

/** Region nowych funkcji; frontend (src/firebase.ts) musi używać tego samego. */
export const REGION = 'europe-central2';

export type Role = 'admin' | 'member';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const requireAdmin = (request: CallableRequest): string => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'Wymagane zalogowanie.');
  }
  if (request.auth.token.role !== 'admin') {
    throw new HttpsError('permission-denied', 'Ta operacja wymaga uprawnień administratora.');
  }
  return request.auth.uid;
};

const findOrCreateUser = async (email: string): Promise<{ user: UserRecord; isNew: boolean }> => {
  try {
    return { user: await getAuth().getUserByEmail(email), isNew: false };
  } catch (error: any) {
    if (error?.code !== 'auth/user-not-found') {
      throw error;
    }
    return { user: await getAuth().createUser({ email }), isNew: true };
  }
};

/**
 * Zaprasza użytkownika: zakłada konto (jeśli go nie ma), nadaje rolę `member`
 * (istniejącej roli nie zmienia) i zwraca link do ustawienia hasła.
 * Link przekazuje się osobie ręcznie. Ponowne wywołanie dla tego samego adresu
 * generuje nowy link (np. gdy poprzedni wygasł).
 */
export const inviteUser = onCall({ region: REGION }, async (request) => {
  const adminUid = requireAdmin(request);

  const rawEmail = request.data?.email;
  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  if (!EMAIL_PATTERN.test(email)) {
    throw new HttpsError('invalid-argument', 'Nieprawidłowy adres email.');
  }

  const { user, isNew } = await findOrCreateUser(email);

  const currentRole = user.customClaims?.role as Role | undefined;
  const role: Role = currentRole ?? 'member';
  if (!currentRole) {
    await getAuth().setCustomUserClaims(user.uid, { role });
  }

  const profile: Record<string, unknown> = { email, role };
  if (isNew) {
    profile.createdAt = FieldValue.serverTimestamp();
    profile.invitedBy = adminUid;
  }
  await getFirestore().doc(`users/${user.uid}`).set(profile, { merge: true });

  const link = await getAuth().generatePasswordResetLink(email);
  return { email, role, link };
});
