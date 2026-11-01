import React, { useCallback, useEffect, useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import type { OnlineEntry } from '../hooks/usePresence';
import styles from './Auth.module.css';

type ActivationStatus = 'invited' | 'password-set' | 'active';

interface UserProfile {
    uid: string;
    email: string;
    role: string;
    status: ActivationStatus;
    createdAt: string | null;
    lastSignInAt: string | null;
}

const STATUS_LABELS: Record<ActivationStatus, string> = {
    invited: 'zaproszony – nie ustawił hasła',
    'password-set': 'hasło ustawione – brak logowania',
    active: 'aktywny'
};

const formatDate = (value: string | null): string =>
    value ? new Date(value).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' }) : '';

interface InviteResult {
    email: string;
    role: string;
    link: string;
}

const inviteUser = httpsCallable<{ email: string }, InviteResult>(functions, 'inviteUser');
const listUsersStatus = httpsCallable<void, { users: UserProfile[] }>(functions, 'listUsersStatus');

const AdminPanel: React.FC<{ online: OnlineEntry[]; onClose: () => void }> = ({ online, onClose }) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [listError, setListError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [inviteError, setInviteError] = useState<string | null>(null);
    const [invite, setInvite] = useState<InviteResult | null>(null);
    const [copied, setCopied] = useState(false);

    const loadUsers = useCallback(async () => {
        try {
            const result = await listUsersStatus();
            setUsers(result.data.users);
            setListError(null);
        } catch (error) {
            console.error('Nie udało się pobrać listy użytkowników:', error);
            const { code, message } = error as { code?: string; message?: string };
            setListError(`Nie udało się pobrać listy użytkowników.${code ? ` (${code}${message ? `: ${message}` : ''})` : ''}`);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const sendInvite = async (address: string, clearInput: boolean) => {
        setInviteError(null);
        setInvite(null);
        setCopied(false);
        setIsInviting(true);
        try {
            const result = await inviteUser({ email: address.trim() });
            setInvite(result.data);
            if (clearInput) setEmail('');
            await loadUsers();
        } catch (error) {
            console.error('Zaproszenie nie powiodło się:', error);
            setInviteError((error as { message?: string })?.message || 'Nie udało się wysłać zaproszenia.');
        } finally {
            setIsInviting(false);
        }
    };

    const handleInvite = (event: React.FormEvent) => {
        event.preventDefault();
        sendInvite(email, true);
    };

    const handleCopy = async () => {
        if (!invite) return;
        try {
            await navigator.clipboard.writeText(invite.link);
            setCopied(true);
        } catch (error) {
            console.warn('Kopiowanie do schowka nie powiodło się:', error);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.panel} role="dialog" aria-label="Użytkownicy" onClick={(event) => event.stopPropagation()}>
                <div className={styles.panelHeader}>
                    <h2 style={{ margin: 0 }}>Użytkownicy</h2>
                    <button className={styles.userBarButton} type="button" onClick={onClose}>Zamknij</button>
                </div>

                <h3 style={{ margin: '0 0 8px' }}>
                    Teraz na stronie ({online.length}: {online.filter((o) => o.isAnonymous).length} gości,{' '}
                    {online.filter((o) => !o.isAnonymous).length} zalogowanych)
                </h3>
                <ul className={styles.userList} style={{ margin: '0 0 20px' }}>
                    {online.length === 0 && <li className={styles.userItem}><small className={styles.role}>Nikt.</small></li>}
                    {online.map((o) => (
                        <li key={o.uid} className={styles.userItem}>
                            <span>{o.isAnonymous ? `Gość (${o.uid.slice(0, 6)})` : o.email}</span>
                            <small className={styles.role}>aktywność: {formatDate(o.lastSeen.toISOString())}</small>
                        </li>
                    ))}
                </ul>

                <form className={styles.inviteRow} onSubmit={handleInvite}>
                    <input
                        className={styles.input}
                        type="email"
                        placeholder="Email zapraszanej osoby"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <button className={styles.primaryButton} style={{ margin: 0 }} type="submit" disabled={isInviting}>
                        {isInviting ? 'Zapraszanie...' : 'Zaproś'}
                    </button>
                </form>

                {inviteError && <p className={styles.error} role="alert">{inviteError}</p>}

                {invite && (
                    <div className={styles.linkBox}>
                        <strong>Konto {invite.email} gotowe.</strong> Przekaż tej osobie link do ustawienia hasła:
                        <code className={styles.linkText}>{invite.link}</code>
                        <button className={styles.userBarButton} type="button" onClick={handleCopy}>
                            {copied ? 'Skopiowano' : 'Kopiuj link'}
                        </button>
                    </div>
                )}

                {listError && <p className={styles.error} role="alert">{listError}</p>}
                <ul className={styles.userList}>
                    {users.map((u) => (
                        <li key={u.uid} className={styles.userItem}>
                            <span>
                                {u.email}
                                <br />
                                <small className={styles.role}>
                                    {STATUS_LABELS[u.status]}
                                    {u.lastSignInAt && ` (ostatnie logowanie: ${formatDate(u.lastSignInAt)})`}
                                </small>
                            </span>
                            <span className={styles.role}>
                                {u.role === 'admin' ? 'administrator' : 'członek'}
                                {u.status !== 'active' && (
                                    <button
                                        className={styles.userBarButton}
                                        style={{ marginLeft: 8 }}
                                        type="button"
                                        disabled={isInviting}
                                        onClick={() => sendInvite(u.email, false)}
                                    >
                                        Nowy link
                                    </button>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminPanel;
