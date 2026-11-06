import React, { useState } from 'react';
import { Tender } from '../types/Tender';
import { docsBadge, docsLinkUrl } from '../utils/docsCheck';
import { checkDocsNow } from '../utils/tendersApi';
import { useAuth } from '../context/AuthContext';
import ExternalIcon from './ExternalIcon';
import styles from './Tenders.module.css';

type Props = {
    tender: Tender;
    /** False, gdy przetargu nie ma już w bazie wspólnej (kopia z zakładki „Zapisane"): serwer nie ma czego sprawdzać. */
    canCheck: boolean;
};

const ANONYMOUS_HINT = 'Zaloguj się na swoje konto, aby sprawdzić dokumenty teraz';

/**
 * Odnośnik do dokumentacji w wierszu linków karty: dla przetargów IT z plakietką stanu (automatyczne sprawdzanie)
 * i przyciskiem „Sprawdź teraz", dla pozostałych zwykły link „Dokumentacja", jeśli znamy adres.
 */
const DocsBadge: React.FC<Props> = ({ tender, canCheck }) => {
    const { user } = useAuth();
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const info = docsBadge(tender);
    const url = docsLinkUrl(tender);
    if (!info) {
        return url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                Dokumentacja <ExternalIcon />
            </a>
        ) : null;
    }

    const isRealAccount = Boolean(user && !user.isAnonymous);
    const classes = `${styles.systemBadge} ${info.tone === 'warn' ? styles.systemBadgeWarn : ''}`;

    const handleCheck = async () => {
        setBusy(true);
        setMessage(null);
        try {
            const result = await checkDocsNow(tender.id);
            // Wynik trafia na kartę sam, przez nasłuch bazy; komunikat dotyczy tylko przypadków, w których nic się nie zmieniło
            if (result.skipped === 'recent') setMessage('Sprawdzono przed chwilą');
            else if (result.state === 'error') setMessage('Platforma nie odpowiada, spróbuj później');
        } catch {
            setMessage('Nie udało się sprawdzić dokumentów');
        } finally {
            setBusy(false);
        }
    };

    const content = url ? (
        <a className={classes} href={url} target="_blank" rel="noopener noreferrer" title={info.title}>{info.text} <ExternalIcon /></a>
    ) : (
        <span className={classes} title={info.title}>
            {info.text}
        </span>
    );

    return (
        <>
            {content}
            {info.canCheckNow && canCheck && (
                <button
                    type="button"
                    className={styles.systemBadgeButton}
                    onClick={handleCheck}
                    disabled={busy || !isRealAccount}
                    title={isRealAccount ? 'Sprawdź dokumenty teraz' : ANONYMOUS_HINT}
                    aria-label="Sprawdź dokumenty teraz"
                >
                    {busy ? '…' : '↻'}
                </button>
            )}
            {message && <span className={styles.systemBadge} role="status">{message}</span>}
        </>
    );
};

export default DocsBadge;
