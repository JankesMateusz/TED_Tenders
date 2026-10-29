import { UserRecord, getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { REGION, Role, requireAdmin } from './access';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
