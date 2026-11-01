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

export type ActivationStatus = 'invited' | 'password-set' | 'active';

export interface UserStatus {
  uid: string;
  email: string;
  role: Role;
  status: ActivationStatus;
  createdAt: string | null;
  lastSignInAt: string | null;
}

const toStatus = (user: UserRecord): UserStatus | null => {
  const role = user.customClaims?.role as Role | undefined;
  if (!role || !user.email) {
    return null;
  }
  const hasPassword = Boolean(user.passwordHash) || user.providerData.some((p) => p.providerId === 'password');
  // Konto bez logowania może mieć lastSignInTime równe czasowi utworzenia (tak robi emulator),
  // więc za faktyczne logowanie uznajemy tylko czas różny od utworzenia.
  const { lastSignInTime, creationTime } = user.metadata;
  const lastSignIn = lastSignInTime && lastSignInTime !== creationTime ? lastSignInTime : null;
  const status: ActivationStatus = lastSignIn ? 'active' : hasPassword ? 'password-set' : 'invited';
  return {
    uid: user.uid,
    email: user.email,
    role,
    status,
    createdAt: user.metadata.creationTime || null,
    lastSignInAt: lastSignIn,
  };
};

/** Lista użytkowników z rolą wraz ze statusem aktywacji konta (tylko dla admina). */
export const listUsersStatus = onCall({ region: REGION }, async (request) => {
  requireAdmin(request);

  const users: UserStatus[] = [];
  let pageToken: string | undefined;
  do {
    const page = await getAuth().listUsers(1000, pageToken);
    for (const user of page.users) {
      const entry = toStatus(user);
      if (entry) {
        users.push(entry);
      }
    }
    pageToken = page.pageToken;
  } while (pageToken);

  users.sort((a, b) => a.email.localeCompare(b.email));
  return { users };
});

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
