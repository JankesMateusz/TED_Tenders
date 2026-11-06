import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { REGION, requireAdmin } from '../access';
import { TenderRecord } from '../tenders/model';
import { ResolverError, ResolverResult, resolveDocuments } from './resolver';

/** Ile przetargów w jednym wywołaniu (pomiar etapu 1) i odstęp między zapytaniami do platform (D15: ok. 1 zapytanie/s). */
const MAX_DOC_IDS = 20;
const DELAY_BETWEEN_TENDERS_MS = Number(process.env.RESOLVER_DELAY_MS ?? 1000);

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export type ResolveOutcome =
  | { docId: string; ok: true; result: ResolverResult }
  | { docId: string; ok: false; error: string };

const resolveOne = async (docId: string): Promise<ResolveOutcome> => {
  const snapshot = await getFirestore().doc(`tenders/${docId}`).get();
  if (!snapshot.exists) return { docId, ok: false, error: 'NOT_FOUND' };
  const tender = snapshot.data() as TenderRecord;
  try {
    return { docId, ok: true, result: await resolveDocuments(tender) };
  } catch (error) {
    if (error instanceof ResolverError) return { docId, ok: false, error: `RESOLVER_ERROR: ${error.message}` };
    throw error;
  }
};

/**
 * Narzędzie diagnostyczne dla admina (TT-2): ustala manifest dokumentacji przetargu, niczego nie zapisuje
 * i niczego nie pobiera. Wejście: `{docId}` albo `{docIds: string[]}` (pomiar etapu 1, do 20 naraz).
 */
export const resolveDocumentsCallable = onCall<{ docId?: string; docIds?: string[] }>(
  { region: REGION, timeoutSeconds: 300 },
  async (request) => {
    requireAdmin(request);
    const { docId, docIds } = request.data ?? {};
    const ids = Array.isArray(docIds) ? docIds : typeof docId === 'string' ? [docId] : [];
    if (ids.length === 0 || ids.length > MAX_DOC_IDS || ids.some((id) => typeof id !== 'string' || !id || id.includes('/'))) {
      throw new HttpsError('invalid-argument', `Podaj docId albo docIds (od 1 do ${MAX_DOC_IDS} identyfikatorów).`);
    }

    const outcomes: ResolveOutcome[] = [];
    for (const [index, id] of ids.entries()) {
      if (index > 0) await sleep(DELAY_BETWEEN_TENDERS_MS);
      outcomes.push(await resolveOne(id));
    }
    return { outcomes };
  },
);
